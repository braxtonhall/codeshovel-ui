import React, {ReactNode} from 'react';
// import logo from './logo.svg';
import './App.css';
import {ArgKind, Pages} from './Enums'
import {Landing} from "./Pages/Landing";
import BackButton from "./BackButton";
import {Files} from "./Pages/Files/Files";
import {Methods} from "./Pages/Methods/Methods";
import {IHistoryTransport, IMethodTransport} from "./Types";
import {BackgroundText} from "./BackgroundText";
import {Constants} from "./Constants";
import {RequestController} from "./RequestController";
import ErrorPane from "./Panes/ErrorPane";
import LoadingPane from "./Panes/LoadingPane";

export default class App extends React.Component<any, IAppState> {
	private history: Pages[];
	private static readonly loadingText = Constants.LOADING_TEXT;
	private static readonly loadFilesErrorText = Constants.FILE_REQUEST_ERROR_TEXT;
	private static readonly loadMethodsErrorText = Constants.METHODS_REQUEST_ERROR_TEXT;
	private static readonly loadHistoryErrorText = Constants.RESULTS_REQUEST_ERROR_TEXT;

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
			fileContent: null,
			methodContent: null,
			historyContent: null
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
	}

	public componentDidMount(): void {
		document.addEventListener('keydown', this.handleKey);
	}

	public componentWillUnmount(): void {
		document.removeEventListener('keydown', this.handleKey);
	}

	private handleKey(event: KeyboardEvent): void {
		if (document.activeElement && document.activeElement.className.includes("form")) {
			return;
		}
		if (event.code === 'Backspace') {
			console.log(document.activeElement ? document.activeElement.className : "NULL");
			setImmediate(this.goBack)
		}
	}

	private proceedToPage(page: Pages, state: IAppState | null = null): void {
		if (!state) {
			state = Object.assign({}, this.state);
		}
		switch (page) {
			case Pages.FILES:
				state.loading = true;
				state.fileContent = null;
				state.file = "";
				RequestController.listFiles(state.link, state.sha)
					.then((content: string[]) => {
						const state: IAppState = Object.assign({}, this.state);
						state.fileContent = content;
						this.finishLoad(page, false, state);
					})
					.catch((err) => {
						this.finishLoad(this.state.page, true)
					});
				break;
			case Pages.METHODS:
				state.loading = true;
				state.methodContent = null;
				RequestController.listMethods(state.link, state.sha, state.file)
					.then((content: IMethodTransport[]) => {
						const state: IAppState = Object.assign({}, this.state);
						state.methodContent = content;
						this.finishLoad(page, false, state);
					})
					.catch((err) => {
						this.finishLoad(this.state.page, true)
					});
				break;
			case Pages.RESULTS:
				state.loading = true;
				state.historyContent = null;
				RequestController.getHistory(state.link, state.sha, state.file, state.method.startLine, state.method.methodName)
					.then((content: IHistoryTransport) => {
						const state: IAppState = Object.assign({}, this.state);
						state.historyContent = content;
						this.finishLoad(page, false, state);
					})
					.catch((err) => {
						this.finishLoad(this.state.page, true)
					});
				break;
			default:
				this.finishLoad(page, false);
				break;
		}
		this.setState(state);
	}

	private finishLoad(page: Pages, error: boolean, state: IAppState | null = null) {
		if (!state) {
			state = Object.assign({}, this.state);
		}
		if (state.page !== page) {
			this.history.push(state.page);
			state.page = page;
		}
		state.loading = false;
		if (error) {
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
		this.setState(state);
	}

	private updateSelected(arg: any, kind: ArgKind): void {
		this.setState(this.getNewStateWithArg(arg, kind));
	}

	private getNewStateWithArg(arg: any, kind: ArgKind): IAppState {
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
		this.proceedToPage(page, this.getNewStateWithArg(arg, kind));
	}

	private closeErrors(): void {
		const state: IAppState = Object.assign({}, this.state);
		if (state.loadFilesError || state.loadMethodsError || state.loadHistoryError) {
			state.loadFilesError = false;
			state.loadMethodsError = false;
			state.loadHistoryError = false;
			this.setState(state);
		}
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
						updateSelected={this.updateSelected}
						proceedWithUpdate={this.proceedWithUpdate}
						page={this.state.page}
					/>
					<Files
						proceedToPage={this.proceedToPage}
						active={this.state.page === Pages.FILES}
						goBack={this.goBack}
						file={this.state.file}
						updateSelected={this.updateSelected}
						page={this.state.page}
						proceedWithUpdate={this.proceedWithUpdate}
						content={this.state.fileContent ? this.state.fileContent : []}
					/>
					<Methods
						proceedToPage={this.proceedToPage}
						active={this.state.page === Pages.METHODS}
						method={this.state.method}
						goBack={this.goBack}
						updateSelected={this.updateSelected}
						proceedWithUpdate={this.proceedWithUpdate}
						page={this.state.page}
						content={this.state.methodContent ? this.state.methodContent : []}
					/>
					<BackButton
						active={this.history.length > 0}
						goBack={this.goBack}
					/>
					<LoadingPane text={App.loadingText} active={this.state.loading} size={{height: 30, width: 72}}/>
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
	fileContent: string[] | null;
	methodContent: IMethodTransport[] | null;
	historyContent: IHistoryTransport | null;
}
