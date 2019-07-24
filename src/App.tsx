import React, {ReactNode} from 'react';
// import logo from './logo.svg';
import './App.css';
import {ArgKind, Key, Pages} from './Enums'
import {Landing} from "./Pages/Landing";
import {Files} from "./Pages/Files/Files";
import {Methods} from "./Pages/Methods/Methods";
import {IHistoryTransport, IMethodTransport, InternalError, ServerBusyError} from "./Types";
import {BackgroundText} from "./BackgroundText";
import {Constants} from "./Constants";
import {RequestController} from "./RequestController";
import ErrorPane from "./Panes/ErrorPane";
import LoadingPane from "./Panes/LoadingPane";
import {Results} from "./Pages/Results/Results";
import {TestController} from "./TestRequestController";
import CopyRawButton from "./Buttons/CopyRawButton";
import SmallButton from "./Buttons/SmallButton";

export default class App extends React.Component<any, IAppState> {
	private history: Pages[];
	private rc: RequestController = Constants.IN_TEST ? new TestController() : new RequestController();
	private static readonly loadingText = Constants.LOADING_TEXT;
	private static readonly loadFilesErrorText = Constants.FILE_REQUEST_ERROR_TEXT;
	private static readonly loadMethodsErrorText = Constants.METHODS_REQUEST_ERROR_TEXT;
	private static readonly loadHistoryErrorText = Constants.RESULTS_REQUEST_ERROR_TEXT;
	private static readonly serverBusyErrorText = Constants.SERVER_BUSY_ERROR_TEXT;
	private static readonly internalErrorText = Constants.INTERNAL_ERROR_TEXT;

	public constructor(props: any) {
		super(props);
		this.state = {
			page: Pages.LANDING,
			link: "",
			file: "",
			sha: "HEAD",
			method: Constants.DEFAULT_METHOD,
			loading: false,
			loadFilesError: false,
			loadMethodsError: false,
			loadHistoryError: false,
			serverBusyError: false,
			internalError: false,
			fileContent: null,
			methodContent: null,
			historyContent: null,
			displayTextCopied: false,
			showAbout: false,
		};
		this.history = [];
		this.proceedToPage = this.proceedToPage.bind(this);
		this.goBack = this.goBack.bind(this);
		this.handleKey = this.handleKey.bind(this);
		this.updateSelected = this.updateSelected.bind(this);
		this.getNewStateWithArg = this.getNewStateWithArg.bind(this);
		this.proceedWithUpdate = this.proceedWithUpdate.bind(this);
		this.finishLoad = this.finishLoad.bind(this);
		this.closeErrors = this.closeErrors.bind(this);
		this.copyText = this.copyText.bind(this);
		this.getNewTestState = this.getNewTestState.bind(this);
		this.showAbout = this.showAbout.bind(this);
	}

	public componentDidMount(): void {
		document.addEventListener('keydown', this.handleKey);
		setTimeout(this.showAbout, Constants.SHOW_ABOUT_DELAY_TIME);
	}

	public componentWillUnmount(): void {
		document.removeEventListener('keydown', this.handleKey);
	}

	private showAbout(): void {
		const state: IAppState = Object.assign({}, this.state);
		state.showAbout = true;
		this.setState(state);
	}

	private handleKey(event: KeyboardEvent): void {
		if (document.activeElement && document.activeElement.className.includes("form")) {
			return;
		}
		if (event.code === Key.BACKSPACE) {
			console.log(document.activeElement ? document.activeElement.className : "NULL");
			setImmediate(this.goBack)
		}
		if (Constants.IN_TEST) {
			switch(event.code) {
				case Key._1:
					this.proceedToPage(Pages.LANDING);
					break;
				case Key._2:
					this.proceedToPage(Pages.FILES);
					break;
				case Key._3:
					this.proceedToPage(Pages.METHODS);
					break;
				case Key._4:
					this.proceedToPage(Pages.RESULTS);
					break;
				case Key._5:
					this.proceedToPage(Pages.ABOUT);
					break;
				default:
					// Do nothing
			}
		}
	}

	private proceedToPage(page: Pages, state: IAppState | null = null): void {
		if(this.state.loading) {
			return; // TODO is this bad?
		}
		if (!state) {
			state = Object.assign({}, this.state);
		}
		switch (page) {
			case Pages.FILES:
				state.loading = true;
				state.fileContent = null;
				state.file = "";
				this.rc.listFiles(state.link, state.sha)
					.then((content: string[]) => {
						const state: IAppState = Object.assign({}, this.state);
						state.fileContent = content;
						this.finishLoad(page, null, state);
					})
					.catch((err) => {
						this.finishLoad(this.state.page, err)
					});
				break;
			case Pages.METHODS:
				state.method = Constants.DEFAULT_METHOD;
				state.loading = true;
				state.methodContent = null;
				this.rc.listMethods(state.link, state.sha, state.file)
					.then((content: IMethodTransport[]) => {
						const state: IAppState = Object.assign({}, this.state);
						state.methodContent = content;
						this.finishLoad(page, null, state);
					})
					.catch((err) => {
						this.finishLoad(this.state.page, err)
					});
				break;
			case Pages.RESULTS:
				state.loading = true;
				state.historyContent = null;
				this.rc.getHistory(state.link, state.sha, state.file, state.method.startLine, state.method.methodName)
					.then((content: IHistoryTransport) => {
						const state: IAppState = Object.assign({}, this.state);
						state.historyContent = content;
						this.finishLoad(page, null, state);
					})
					.catch((err) => {
						this.finishLoad(this.state.page, err)
					});
				break;
			default:
				this.finishLoad(page, null, state);
				return;
		}
		this.setState(state);
	}

	private finishLoad(page: Pages, error: Error | null, state: IAppState | null = null) {
		if (!state) {
			state = Object.assign({}, this.state);
		}
		if (state.page !== page) {
			this.history.push(state.page);
			state.page = page;
		}
		state.loading = false;
		if (error){
			if (error instanceof ServerBusyError) {
				state.serverBusyError = true;
			} else if (error instanceof InternalError) {
				state.internalError = true;
			} else {
				switch (page) {
					case Pages.LANDING:
						state.loadFilesError = true;
						break;
					case Pages.FILES:
						state.loadMethodsError = true;
						break;
					case Pages.METHODS:
						state.loadHistoryError = true;
						break;
				}
			}
		}
		this.setState(state);
	}

	private updateSelected(arg: any, kind: ArgKind): void {
		this.getNewStateWithArg(arg, kind).then((state) => this.setState(state));
		// this.setState();
	}

	private async getNewStateWithArg(arg: any, kind: ArgKind): Promise<IAppState> {
		if (Constants.IN_TEST) {
			return await this.getNewTestState(kind);
		}
		const state: IAppState = Object.assign({}, this.state);
		switch (kind) {
			case ArgKind.FILE:
				state.file = arg;
				break;
			case ArgKind.SHA:
				state.sha = arg;
				break;
			case ArgKind.METHOD:
				state.method = arg;
				break;
			case ArgKind.REPO:
				state.link = arg;
				state.sha = "HEAD";
				break;
			default:
				console.error("Update Selected Illegal case");
				return this.state;
		}
		return state;
	}

	private async getNewTestState(kind: ArgKind): Promise<IAppState> {
		const state: IAppState = Object.assign({}, this.state);
		switch (kind) {
			case ArgKind.FILE:
				state.file = await TestController.getFile();
				break;
			case ArgKind.SHA:
				state.sha = "HEAD";
				break;
			case ArgKind.METHOD:
				state.method = await TestController.getMethod();
				break;
			case ArgKind.REPO:
				state.link = await TestController.getRepo();
				state.sha = "HEAD";
				break;
			default:
				console.error("Update Selected Illegal case");
				return this.state;
		}
		return state;
	}

	private goBack(): void {
		const state: IAppState = Object.assign({}, this.state);
		const lastPage: Pages | undefined = this.history.pop();
		if (lastPage !== undefined && lastPage !== state.page) {
			state.page = lastPage;
			if (lastPage === Pages.LANDING) {
				state.sha = "HEAD";
			}
			this.setState(state);
		}
	}

	private proceedWithUpdate(page: Pages, arg: any, kind: ArgKind): void {
		this.getNewStateWithArg(arg, kind).then((state) => this.proceedToPage(page, state));
		// this.proceedToPage(page, );
	}

	private closeErrors(): void {
		const state: IAppState = Object.assign({}, this.state);
		if (state.loadFilesError ||
			state.loadMethodsError ||
			state.loadHistoryError ||
			state.serverBusyError ||
			state.internalError) {
			state.loadFilesError = false;
			state.loadMethodsError = false;
			state.loadHistoryError = false;
			state.serverBusyError = false;
			state.internalError = false;
			this.setState(state);
		}
	}

	private copyText(): void {
		const element = document.createElement('textarea');
		if (this.state.loading) {
			element.value = "Loading... One moment.";
		} else {
			switch (this.state.page) {
				case Pages.FILES:
					element.value = JSON.stringify(this.state.fileContent);
					break;
				case Pages.METHODS:
					element.value = JSON.stringify(this.state.methodContent);
					break;
				case Pages.RESULTS:
					element.value = JSON.stringify(this.state.historyContent);
					break;
				default:
					element.value = "No Easter Egg here. Go away!";
			}
		}
		element.setAttribute('readonly', '');
		document.body.appendChild(element);
		element.select();
		if (document.execCommand('copy')) {
			const state: IAppState = Object.assign({}, this.state);
			state.displayTextCopied = true;
			const that: App = this;
			setTimeout(function () {
				const state: IAppState = Object.assign({}, that.state);
				state.displayTextCopied = false;
				that.setState(state)
			}, Constants.NOTIFICATION_DISPLAY_TIME);
			this.setState(state);
		}
		document.body.removeChild(element);
	}

	public render(): ReactNode {
		return(
			<header className="App-header">
				<div
					style={{
						textAlign: "center",
						height: "100%",
						width: "100%",
						top: "0",
						left: "0",
						position: "fixed",
					}}
				>
					<BackgroundText
						file={this.state.file}
						page={this.state.page}
						method={this.state.method}
						sha={this.state.sha}
						repo={this.state.link}
					/>
					<Landing
						proceedToPage={this.proceedToPage}
						active={this.state.page === Pages.LANDING}
						proceedWithUpdate={this.proceedWithUpdate}
						page={this.state.page}
					/>
					<Files
						proceedToPage={this.proceedToPage}
						active={this.state.page === Pages.FILES}
						file={this.state.file}
						page={this.state.page}
						proceedWithUpdate={this.proceedWithUpdate}
						content={this.state.fileContent ? this.state.fileContent : []}
					/>
					<Methods
						proceedToPage={this.proceedToPage}
						active={this.state.page === Pages.METHODS}
						method={this.state.method}
						proceedWithUpdate={this.proceedWithUpdate}
						page={this.state.page}
						content={this.state.methodContent ? this.state.methodContent : []}
					/>
					<Results
						proceedToPage={this.proceedToPage}
						active={this.state.page === Pages.RESULTS}
						page={this.state.page}
						content={this.state.historyContent ? this.state.historyContent : {}}
						repo={this.state.link}
						file={this.state.file}
					/>
					<SmallButton
						active={this.history.length > 0}
						onClick={this.goBack}
						width={30}
						height={30}
						backgroundImage={"url(/left.png)"}
						backgroundSize={15}
						left={5}
						bottom={40}
					/>
					<SmallButton
						active={this.state.page !== Pages.ABOUT && this.state.showAbout}
						onClick={() => this.proceedToPage(Pages.ABOUT)}
						width={30}
						height={30}
						backgroundImage={"url(/question.png)"}
						backgroundSize={15}
						left={5}
						bottom={5}
					/>
					<CopyRawButton
						active={this.state.page > Pages.LANDING && this.state.page < Pages.ABOUT}
						handleClick={() => setImmediate(this.copyText)}
						displayNotification={this.state.displayTextCopied}
					/>
					<LoadingPane text={App.loadingText} active={this.state.loading} size={{height: 30, width: 72}}/>
					<ErrorPane text={App.serverBusyErrorText} active={this.state.serverBusyError} size={{height: 30, width: 72}} exit={this.closeErrors}/>
					<ErrorPane text={App.internalErrorText} active={this.state.internalError} size={{height: 30, width: 72}} exit={this.closeErrors}/>
					<ErrorPane text={App.loadFilesErrorText} active={this.state.loadFilesError} size={{height: 30, width: 72}} exit={this.closeErrors}/>
					<ErrorPane text={App.loadMethodsErrorText} active={this.state.loadMethodsError} size={{height: 30, width: 72}} exit={this.closeErrors}/>
					<ErrorPane text={App.loadHistoryErrorText} active={this.state.loadHistoryError} size={{height: 30, width: 72}} exit={this.closeErrors}/>
				</div>
			</header>
		);
	}
}

export interface IAppState {
	page: Pages;
	link: string;
	file: string;
	sha: string;
	method: IMethodTransport;
	loading: boolean;
	loadFilesError: boolean;
	loadMethodsError: boolean;
	loadHistoryError: boolean;
	serverBusyError: boolean;
	internalError: boolean;
	fileContent: string[] | null;
	methodContent: IMethodTransport[] | null;
	historyContent: IHistoryTransport | null;
	displayTextCopied: boolean;
	showAbout: boolean;
}
