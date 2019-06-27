import * as React from "react";
import {FormEvent, ReactNode} from "react";
import {IPageState, Page} from "./Page";
import {ArgKind, Pages} from "../Enums";
import {IFilesProps} from "./Files";
import * as rp from "request-promise-native";
import {FadeableElement, IFadeableElementProps, IFadeableElementState} from "../FadeableElement";
import {Constants} from "../Constants";
import Form from "react-bootstrap/Form";
import ErrorPane from "../ErrorPane";
import LoadingPane from "../LoadingPane";
import Button from "react-bootstrap/Button";
import {IMethodTransport} from "../Types";

export class Methods extends Page<IMethodsProps, IMethodsState> {
	private readonly requestErrorText: string = Constants.METHODS_REQUEST_ERROR_TEXT;
	private readonly methodInputPlaceholder: string = Constants.METHODS_SEARCH_TEXT;
	private readonly loadingText: string = Constants.METHODS_LOADING_TEXT;
	private file: string;
	private content: IMethodTransport[];

	public constructor(props: IMethodsProps) {
		super(props);
		this.state = {
			onScreen: this.props.active,
			loading: false,
			requestError: false,
			search: "",
		};
		this.file = "";
		this.content = [];
		this.updateMethods = this.updateMethods.bind(this);
		this.finishLoad = this.finishLoad.bind(this);
		this.updateSelected = this.updateSelected.bind(this);
		this.handleKey = this.handleKey.bind(this);
		this.handleCloseRequestError = this.handleCloseRequestError.bind(this);
		this.handleEnter = this.handleEnter.bind(this);
	}

	private handleKey(): void {
		const searchElement: HTMLInputElement = (document.getElementById("searchInput") as HTMLInputElement);
		if (searchElement && typeof searchElement.value === "string" && searchElement.value !== this.state.search) {
			const state: IMethodsState = Object.assign({}, this.state);
			state.search = searchElement.value;
			this.setState(state);
		}
	}

	protected handleNext(): void {
		if (this.validSelection()) {
			this.props.proceedToPage(Pages.RESULTS);
		}
	}

	private validSelection(method?:IMethodTransport): boolean {
		method = method ? method : this.props.method;
		return method.longName !== "" && method.startLine >= 0;
	}

	private handleEnter(event: FormEvent): void {
		event.preventDefault();
		const searchMethods = this.content
			.filter((method: IMethodTransport) =>
				method.longName.includes(this.state.search)
			);
		if (searchMethods.length === 1 && this.validSelection(searchMethods[0])) {
			this.props.proceedWithUpdate(Pages.RESULTS, searchMethods[0], ArgKind.METHOD)
		}
	}

	private updateMethods(): void {
		if (this.file !== this.props.file) {
			this.file = this.props.file;
			this.content = [];
			const url = "http://localhost:8080/listMethods"; // TODO
			const opts: rp.RequestPromiseOptions = {
				rejectUnauthorized: false,
				strictSSL: false,
				method: 'get',
			};
			const qs: {[key: string]: string | boolean} = {
				gitUrl: this.props.link,
				sha: this.props.sha,
				filePath: this.file,
			};
			// @ts-ignore
			rp(url, {qs, ...opts})
				.then((response: any) => {
					try {
						this.content = JSON.parse(response)
							.sort((a: IMethodTransport, b: IMethodTransport) => {
								if (a.longName < b.longName) {
									return -1;
								} else if (a.longName > b.longName) {
									return 1;
								} else {
									return 0;
								}
							});
						this.finishLoad(this.content.length === 0);
					} catch (err) {
						this.finishLoad(true);
					}
				})
				.catch((err: any) => {
					this.finishLoad(true);
				});
			const state: IMethodsState = Object.assign({}, this.state);
			state.loading = true;
			state.requestError = false;
			state.search = "";
			this.updateSelected({longName: "", startLine: -1, methodName: ""});
			this.setState(state);
		}
	}

	private updateSelected(method: {longName: string, startLine: number, methodName: string}): void {
		this.props.updateSelected(method, ArgKind.METHOD);
	}

	private finishLoad(error: boolean = false): void {
		const state: IMethodsState = Object.assign({}, this.state);
		state.loading = false;
		if (error) {
			state.requestError = true;
		}
		this.setState(state);
	}

	private handleCloseRequestError(): void {
		this.props.goBackWithUpdate("", ArgKind.FILE);
	}

	public render(): ReactNode {
		setImmediate(this.updateMethods);
		if (this.state.onScreen || this.props.active) {
			setImmediate(this.setOnScreen);
		}
		return (
			<div
				style={{
					opacity: this.props.active ? 1 : 0,
					transition: this.fadeOutTime + "ms ease-in-out",
				}}
			>
				{(this.state.onScreen || this.props.active) ?
					<div>
						<div
							style={{
								position: "absolute",
								right: "-1%",
								top: "2%",
								font: "200% \"Courier New\", Futura, sans-serif",
								textAlign: "right",
								fontStyle: "italic",
							}}
						>
							Select a method.
						</div>
						<div style={{
							height: "100%",
							width: "100%",
							top: "50%",
							left: "50%",
							position: "absolute",
							transform: "translate(-50%, -50%)",
							opacity: 0.8,
							animation: `${this.chooseAnimation("8")}  ${this.fadeOutTime}ms ease-in-out`,
						}}>
							<MethodContainer
								methods={this.content}
								search={this.state.search}
								tellParent={this.updateSelected}
							/>
						</div>
						<div
							style={{
								width: "20%",
								position: "absolute",
								right: "2%",
								top: "10%",
							}}
						>
							<Form onSubmit={this.handleEnter}>
								<Form.Control id="searchInput" size="sm" type="text" placeholder={this.methodInputPlaceholder} onChange={this.handleKey}/>
							</Form>
						</div>
						<div
							style={{
								position: "absolute",
								top: "15%",
								right: "2%",
							}}
						>
							<Button variant="primary" onClick={this.handleNext} disabled={this.props.method.methodName === ""}>Next</Button>
						</div>
						<LoadingPane text={this.loadingText} active={this.state.loading && this.props.active} size={{height: 30, width: 72}}/>
						<ErrorPane text={this.requestErrorText} active={this.state.requestError && this.props.active} size={{height: 30, width: 72}} exit={this.handleCloseRequestError}/>
					</div> : <div/>
				}
			</div>
		);
	}

}

class MethodContainer extends React.Component<IMethodContainerProps, any> {
	public constructor(props: IMethodContainerProps) {
		super(props);
		this.tellParent = this.tellParent.bind(this);
	}

	private tellParent(method: IMethodTransport): void {
		this.props.tellParent(method);
	}

	public render(): ReactNode {
		return(
			<div
				className="Panel"
				style={{
					display: "block",
					textAlign: "left",
					height: "100%",
					width: "100%"
				}}
			>
				<div
					style={{
						position: "absolute",
						left: "5%",
						// transform: "translate(-50%, 0)",
					}}
				>
					{
						this.props.methods
							.map((method: {longName: string, startLine: number, methodName: string}, i: number) => (
								<ReactMethod
									method={method}
									search={this.props.search}
									tellParent={this.tellParent}
									active={method.longName.includes(this.props.search)}
									index={i}
									key={i}
								/>
							))
					}
				</div>
			</div>
		);
	}
}

class ReactMethod extends FadeableElement<IReactMethodProps, IReactMethodState> {
	protected readonly fadeOutTime: number = Constants.METHODS_METHOD_ANIMATE_TIME;
	protected readonly marginModifier: number;
	private turnedOn: boolean;

	constructor(props: IReactMethodProps) {
		super(props);
		const inSearch: boolean = this.props.method.longName.includes(this.props.search);
		let marginModifier: number = Math.floor(Math.random() * Constants.METHODS_MAX_INDENT_UNIT_COUNT);
		marginModifier = marginModifier * Constants.METHODS_INDENT_UNIT_PX;
		marginModifier = marginModifier + this.props.index * Constants.METHODS_INDENT_UNIT_PX;
		this.marginModifier = marginModifier;
		this.state = {
			onScreen: this.props.active && inSearch,
			margin: this.marginModifier,
		};
		this.turnedOn = false;
		this.handleClick = this.handleClick.bind(this);
		this.mouseDown = this.mouseDown.bind(this);
		this.tellParent = this.tellParent.bind(this);
	}

	private handleClick(): void {
		if (this.props.active) {
			setImmediate(this.tellParent);
		}
		const state: IReactMethodState = Object.assign({}, this.state);
		state.margin = this.marginModifier;
		this.setState(state);
	}

	private mouseDown(): void {
		const state: IReactMethodState = Object.assign({}, this.state);
		state.margin = this.marginModifier + Constants.LIST_ELEMENT_NEW_LINE_PX_COUNT;
		this.setState(state);
	}

	private tellParent(): void {
		this.props.tellParent(this.props.method);
	}

	public render(): ReactNode {
		const style = {display: "inline-block"};
		const animation: string = this.turnedOn ? "" : `Expand ${this.fadeOutTime}ms ease-in-out`;
		if (!this.turnedOn) {
			this.turnedOn = true;
		}
		return (
			<div
				style={{
					marginLeft: this.state.margin +  "px",
					marginTop: this.props.active ? "3px" : "0",
					marginBottom: this.props.active ? "3px" : "1px",
					backgroundColor: "rgb(124, 124, 124)",
					height: this.props.active ? "40px" : "8px",
					font: (this.props.active ? 100 : 12) + "% \"Courier New\", Futura, sans-serif",
					width: "650px",
					overflow: "hidden",
					transition: this.fadeOutTime + "ms ease-in-out",
					opacity: this.props.active ? 1 : 0.5,
					animation,
				}}
				onClick={this.handleClick}
				onMouseDown={this.mouseDown}
			>
				{
					this.props.search === "" || !this.props.active ? this.props.method.longName : this.props.method.longName.split(this.props.search).flatMap(
						(s, i, list) => list.length - 1 !== i ? [<div key={2 * i} style={style}>{s}</div>, <code key={2 * i + 1} style={style}>{this.props.search}</code>] : <div key={2 * i} style={style}>{s}</div>,
					)
				}
			</div>
		);
	}
}

export interface IMethodsProps extends IFilesProps {
	method: IMethodTransport;
	goBackWithUpdate: (arg: any, kind: ArgKind) => void;
	proceedWithUpdate: (page: Pages, arg: any, kind: ArgKind) => void;
}

export interface IMethodsState extends IPageState {
	loading: boolean;
	requestError: boolean;
	search: string;
}

export interface IMethodContainerProps {
	methods: {longName: string, startLine: number, methodName: string}[];
	search: string;
	tellParent: (method: IMethodTransport) => void;
}

export interface IReactMethodProps extends IFadeableElementProps {
	method: IMethodTransport;
	search: string;
	tellParent: (method: {longName: string, startLine: number, methodName: string}) => void;
	index: number;
}

export interface IReactMethodState extends IFadeableElementState {
	margin: number;
}
