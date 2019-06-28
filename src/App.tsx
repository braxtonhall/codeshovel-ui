import React, {ReactNode} from 'react';
// import logo from './logo.svg';
import './App.css';
import {ArgKind, Pages} from './Enums'
import {Landing} from "./Pages/Landing";
import BackButton from "./BackButton";
import {Files} from "./Pages/Files/Files";
import {Methods} from "./Pages/Methods/Methods";
import {IMethodTransport} from "./Types";
import {BackgroundText} from "./BackgroundText";

export default class App extends React.Component<any, IAppState> {
	private history: Pages[];

	public constructor(props: any) {
		super(props);
		this.state = {
			page: Pages.LANDING,
			link: "",
			forward: true,
			file: "",
			sha: "HEAD",
			method: {methodName: "", startLine: -1, longName: ""}
		};
		this.history = [];
		this.proceedToPage = this.proceedToPage.bind(this);
		this.goBack = this.goBack.bind(this);
		this.setLink = this.setLink.bind(this);
		this.handleKey = this.handleKey.bind(this);
		this.updateSelected = this.updateSelected.bind(this);
		this.goBackWithUpdate = this.goBackWithUpdate.bind(this);
		this.getNewStateWithArg = this.getNewStateWithArg.bind(this);
		this.proceedWithUpdate = this.proceedWithUpdate.bind(this);
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

	private proceedToPage(page: Pages): void {
		const state: IAppState = Object.assign({}, this.state);
		if (state.page !== page) {
			this.history.push(state.page);
			state.page = page;
			state.forward = true;
			this.setState(state);
		}
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
			state.forward = false;
			state.page = lastPage;
			this.setState(state);
		}
	}

	private goBackWithUpdate(arg: any, kind: ArgKind): void {
		const state = this.getNewStateWithArg(arg, kind);
		const lastPage: Pages | undefined = this.history.pop();
		if (lastPage !== undefined && lastPage !== state.page) {
			state.forward = false;
			state.page = lastPage;
		}
		this.setState(state);
	}

	private proceedWithUpdate(page: Pages, arg: any, kind: ArgKind): void {
		const state = this.getNewStateWithArg(arg, kind);
		if (state.page !== page) {
			this.history.push(state.page);
			state.page = page;
			state.forward = true;
		}
		this.setState(state);
	}

	private setLink(link: string): void {
		const state: IAppState = Object.assign({}, this.state);
		if (link !== this.state.link) {
			state.link = link;
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
						forward={this.state.forward}
						updateSelected={this.updateSelected}
						proceedWithUpdate={this.proceedWithUpdate}
						page={this.state.page}
					/>
					<Files
						proceedToPage={this.proceedToPage}
						active={this.state.page === Pages.FILES}
						forward={this.state.forward}
						link={this.state.link}
						goBack={this.goBack}
						file={this.state.file}
						sha={this.state.sha}
						updateSelected={this.updateSelected}
						page={this.state.page}
					/>
					<Methods
						proceedToPage={this.proceedToPage}
						active={this.state.page === Pages.METHODS}
						forward={this.state.forward}
						link={this.state.link}
						goBack={this.goBack}
						file={this.state.file}
						sha={this.state.sha}
						updateSelected={this.updateSelected}
						method={this.state.method}
						goBackWithUpdate={this.goBackWithUpdate}
						proceedWithUpdate={this.proceedWithUpdate}
						page={this.state.page}
					/>

					<BackButton
						active={this.history.length > 0}
						goBack={this.goBack}
					/>
				</div>
			</header>
		);
	}
}

export interface IAppState {
	page: Pages;
	link: string;
	forward: boolean;
	file: string;
	sha: string;
	method: IMethodTransport;
}
