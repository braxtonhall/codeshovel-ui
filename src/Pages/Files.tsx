import * as React from "react";
import {FormEvent, ReactNode} from "react";
import {IPageProps, IPageState, Page} from "./Page";
import {ArgKind, Pages} from "../Enums";
import * as rp from "request-promise-native";
import ErrorPane from "../ErrorPane";
import Button from "react-bootstrap/Button";
import {Constants} from "../Constants";
import LoadingPane from "../LoadingPane";
import {FadeableElement, IFadeableElementProps, IFadeableElementState} from "../FadeableElement";
import Form from "react-bootstrap/Form";

export class Files extends Page<IFilesProps, IFilesState> {
	private readonly requestErrorText: string = Constants.FILE_REQUEST_ERROR_TEXT;
	private readonly loadingText: string = Constants.FILE_LOADING_TEXT;
	private readonly shaPlaceholder: string = Constants.FILE_SHA_PLACEHOLDER_TEXT;
	private readonly shaErrorText: string = Constants.FILE_SHA_ERROR_TEXT;

	private link: string;
	private sha: string;
	private content: Directory;

	public constructor(props: IFilesProps) {
		super(props);
		this.state = {
			onScreen: this.props.active,
			loading: false,
			requestError: false,
			shaError: false,
		};
		this.link = "";
		this.sha = "HEAD";
		this.content = new Directory(".", [], this.updateSelected);
		this.finishLoad = this.finishLoad.bind(this);
		this.handleCloseRequestError = this.handleCloseRequestError.bind(this);
		this.closeRequestError = this.closeRequestError.bind(this);
		this.closeShaError = this.closeShaError.bind(this);
		this.updateFiles = this.updateFiles.bind(this);
		this.buildDirectory = this.buildDirectory.bind(this);
		this.updateSelected = this.updateSelected.bind(this);
		this.handleRefresh = this.handleRefresh.bind(this);
		this.handleShaEnter = this.handleShaEnter.bind(this);
		this.updateSha = this.updateSha.bind(this);
	}

	protected handleNext(): void {
		if (this.props.file !== "") {
			this.props.proceedToPage(Pages.METHODS);
		}
	}

	private handleRefresh(): void {
		const shaElement: HTMLInputElement = (document.getElementById("shaInput") as HTMLInputElement);
		const state: IFilesState = Object.assign({}, this.state);
		if (shaElement && shaElement.value) {
			setImmediate(() => this.updateSha(shaElement.value));
		} else {
			state.shaError = true;
		}
		this.setState(state);
	}

	private updateSelected(path: string): void {
		this.props.updateSelected(path, ArgKind.FILE);
	}

	private updateSha(sha: string) {
		this.props.updateSelected(sha, ArgKind.SHA);
	}

	private updateFiles(): void {
		if (this.props.link !== this.link || this.sha !== this.props.sha) {
			this.link = this.props.link;
			this.sha = this.props.sha;
			this.content = new Directory(".", [], this.updateSelected);
			const url = "http://localhost:8080/listFiles"; // TODO
			const opts: rp.RequestPromiseOptions = {
				rejectUnauthorized: false,
				strictSSL: false,
				method: 'get',
			};
			const qs: {[key: string]: string | boolean} = {
				gitUrl: this.link,
				sha: this.props.sha,
			};
			// @ts-ignore
			rp(url, {qs, ...opts})
				.then((response: any) => {
					try {
						this.buildDirectory(JSON.parse(response).sort());
						this.finishLoad(this.content.getDirectories().length === 0);
					} catch (err) {
						this.finishLoad(true);
					}
				})
				.catch((err: any) => {
					this.finishLoad(true);
				});
			const state: IFilesState = Object.assign({}, this.state);
			state.loading = true;
			state.shaError = false;
			this.updateSelected("");
			this.setState(state);
		}
	}

	private finishLoad(error: boolean = false): void {
		const state: IFilesState = Object.assign({}, this.state);
		state.loading = false;
		if (error) {
			state.requestError = true;
			if (this.props.sha !== "HEAD") {
				this.updateSha("HEAD");
			}
		}
		this.setState(state);
	}

	private handleCloseRequestError(): void {
		setTimeout(this.closeRequestError, this.fadeOutTime * 2);
		this.props.goBack();
	}

	private handleShaEnter(event: FormEvent): void {
		event.preventDefault();
		this.handleRefresh();
	}

	private closeShaError(): void {
		const state: IFilesState = Object.assign({}, this.state);
		state.shaError = false;
		this.setState(state);
	}

	private closeRequestError(): void {
		const state: IFilesState = Object.assign({}, this.state);
		state.requestError = false;
		this.setState(state);
	}

	private buildDirectory(files: string[]): void {
		this.content = new Directory(".", files, this.updateSelected);
	}

	public render(): ReactNode {
		setImmediate(this.updateFiles);
		if (this.state.onScreen || this.props.active) {
			setImmediate(this.setOnScreen);
			return (
				<div>
					<div
						style={{
							position: "absolute",
							right: "1%",
							top: "58%",
							font: "200% \"Courier New\", Futura, sans-serif",
							textAlign: "right",
							fontStyle: "italic",
							opacity: this.props.active ? 1 : 0,
							animation: `Fade-${this.props.active ? "In" : "Out"} ${this.fadeOutTime}ms ease-in-out`,
						}}
					>
						Select a<br/>file.{'\u00A0\u00A0'}
					</div>
					<div
						style={{
							position: "fixed",
							overflowY: "scroll",
							height: "100%",
							width: "100%",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							opacity: this.props.active ? 0.8 : 0,
							animation: `${this.chooseAnimation("8")}  ${this.fadeOutTime}ms ease-in-out`,
						}}
					>
						<FileContainer dir={this.content}/>
					</div>
					<div
						style={{
							position: "absolute",
							right: "0",
							bottom: "0",
							width: "28%",
							height: "34%",
							opacity: this.props.active ? 1 : 0,
							zIndex: 0,
							// transition: this.fadeOutTime + "ms ease-in-out",
							animation: `Fade-${this.props.active ? "In" : "Out"}  ${this.fadeOutTime}ms ease-in-out`,
						}}
					>
						<div
							style={{
								position: "absolute",
								top: "0",
								right: "2%",
							}}
						>
							<Button variant="primary" onClick={this.handleNext} disabled={this.props.file === ""}>Next</Button>
						</div>
						<div
							style={{
								// transform: "translate(108%, 400%)",
								position: "absolute",
								bottom: "10%",
								right: "2%", // TODO delete this div and attach directly
								width: "100%",
								// justifyContent: "left",
							}}
						>
							<Form onSubmit={this.handleShaEnter}>
								<Form.Control id="shaInput" size="sm" type="text" placeholder={this.shaPlaceholder}/>
							</Form>
							<Button style={{marginTop: "1%", marginLeft: "auto", marginRight: "5%", position: "relative", float: "right",}} variant="primary" onClick={this.handleRefresh} disabled={false}>Refresh</Button>
						</div>
					</div>
					<LoadingPane text={this.loadingText} active={this.state.loading && this.props.active} size={{height: 30, width: 72}}/>
					<ErrorPane text={this.requestErrorText} active={this.state.requestError && this.props.active} size={{height: 30, width: 72}} exit={this.handleCloseRequestError}/>
					<ErrorPane text={this.shaErrorText} active={this.state.shaError && this.props.active} size={{height: 30, width: 72}} exit={this.closeShaError}/>
				</div>
			);
		} else {
			return <div/>;
		}
	}
}

class Directory {
	private readonly name: string;
	private readonly subDirs: Directory[];
	private readonly files: File[];
	private readonly alerter: (name: string) => void;

	constructor(name: string, contents: string[], alerter: (name: string) => void) {
		this.name = name;
		this.files = [];
		this.alerter = alerter;
		this.tellParent = this.tellParent.bind(this);
		const subDirs: {[name: string]: string[]} = {};
		for (const entry of contents) {
			const path = entry.split(/\/(.+)/);
			if (path.length === 1) {
				this.files.push(new File(entry, this.tellParent));
			} else {
				if (!subDirs[path[0]]) {
					subDirs[path[0]] = [];
				}
				subDirs[path[0]].push(path[1]);
			}
		}
		this.subDirs = Object.keys(subDirs).map((key: string) => new Directory(key, subDirs[key], this.tellParent));
	}

	private tellParent(path: string): void {
		this.alerter(this.name + "/" + path);
	}

	public getDirectories(): Directory[] {
		return this.subDirs;
	}

	public getFiles(): File[] {
		return this.files;
	}

	public getName(): string {
		return this.name;
	}

	public toReactNode(): ReactNode {
		return <ReactDirectory dir={this} level={0} active={true}/>
	}
}

class File {
	private readonly name: string;
	private readonly alerter: (name: string) => void;

	constructor(name: string, alerter: (name: string) => void) {
		this.name = name;
		this.alerter = alerter;
		this.tellParent = this.tellParent.bind(this);
	}

	public tellParent(): void {
		this.alerter(this.name);
	}

	public getName(): string {
		return this.name;
	}
}

class ReactDirectory extends FadeableElement<IReactDirectoryProps, IReactDirectoryState> {
	protected readonly fadeOutTime: number = 300;

	constructor(props: IReactDirectoryProps) {
		super(props);
		if (this.props.level === 0) {
			this.state = {onScreen: this.props.active, expanded: true, margin: 0};
		} else {
			this.state = {onScreen: this.props.active, expanded: false, margin: 0};
		}
		// this.mouseUp = this.mouseUp.bind(this);
		this.mouseDown = this.mouseDown.bind(this);
		this.toggleExpanded = this.toggleExpanded.bind(this);
	}

	private toggleExpanded(): void {
		const state: IReactDirectoryState = Object.assign({}, this.state);
		state.expanded = !state.expanded;
		state.margin = 0;
		this.setState(state);
	}

	private mouseDown(): void {
		const state: IReactDirectoryState = Object.assign({}, this.state);
		state.margin = Constants.LIST_ELEMENT_NEW_LINE_PX_COUNT;
		this.setState(state);
	}

	public render(): ReactNode {
		if (this.state.onScreen || this.props.active) {
			setImmediate(this.setOnScreen);
			return(
				<div
					style={{display: "block"}}
				>
					<div
						style={{
							marginLeft: (this.props.level * Constants.LIST_ELEMENT_NEW_LINE_PX_COUNT) + this.state.margin + "px",
							animation: `${this.props.active ? "Expand" : "Contract"}  ${this.fadeOutTime}ms ease-in-out`,
							marginTop: "3px",
							marginBottom: "3px",
							backgroundColor: "rgb(75, 75, 124)",
							height: this.props.active ? "40px" : "0",
							font: "100% \"Courier New\", Futura, sans-serif",
							width: "650px",
							overflow: "hidden",
							zIndex: 9999,
							transition: this.fadeOutTime + "ms ease-in-out",
						}}
						onClick={this.toggleExpanded}
						onMouseDown={this.mouseDown}
					>
						{/*{this.props.active ? this.props.dir.getName() : ""}*/this.props.dir.getName() + "/"}
					</div>
					{this.props.dir.getDirectories()
						.map((dir: Directory, i: number) => <ReactDirectory dir={dir} level={this.props.level + 1} key={i} active={this.state.expanded && this.props.active}/>)}
					{this.props.dir.getFiles()
						.map((file: File, i: number) => <ReactFile file={file} level={this.props.level + 1} key={i} active={this.state.expanded && this.props.active}/>)}

				</div>
			);
		} else {
			const style = {marginLeft: (this.props.level * Constants.LIST_ELEMENT_NEW_LINE_PX_COUNT) + this.state.margin + "px"};
			return <div style={style}/>;
		}
	}
}

class ReactFile extends FadeableElement<IReactFileProps, IReactFileState> {
	protected readonly fadeOutTime: number = 300;

	constructor(props: IReactFileProps) {
		super(props);
		this.state = {selected: false, onScreen: this.props.active, margin: 0};
		this.handleClick = this.handleClick.bind(this);
		this.mouseDown = this.mouseDown.bind(this);
	}

	private handleClick(): void {
		setImmediate(this.props.file.tellParent);
		const state: IReactFileState = Object.assign({}, this.state);
		state.margin = 0;
		this.setState(state);
	}

	private mouseDown(): void {
		const state: IReactFileState = Object.assign({}, this.state);
		state.margin = Constants.LIST_ELEMENT_NEW_LINE_PX_COUNT;
		this.setState(state);
	}

	public render(): ReactNode {
		if (this.state.onScreen || this.props.active) {
			setImmediate(this.setOnScreen);
			return (
				<div
					style={{
						marginLeft: (this.props.level * Constants.LIST_ELEMENT_NEW_LINE_PX_COUNT) + this.state.margin +  "px",
						animation: `${this.props.active ? "Expand" : "Contract"}  ${this.fadeOutTime}ms ease-in-out`,
						marginTop: "3px",
						marginBottom: "3px",
						backgroundColor: "rgb(124, 124, 124)",
						height: this.props.active ? "40px" : "0",
						font: "100% \"Courier New\", Futura, sans-serif",
						width: (650 - Constants.LIST_ELEMENT_NEW_LINE_PX_COUNT * 1.5) + "px",
						overflow: "hidden",
						transition: this.fadeOutTime + "ms ease-in-out",
					}}
					onClick={this.handleClick}
					onMouseDown={this.mouseDown}
				>
					{/*{this.props.active ? this.props.file.getName() : ""}*/this.props.file.getName()}
				</div>
			);
		} else {
			const style = {marginLeft: (this.props.level * Constants.LIST_ELEMENT_NEW_LINE_PX_COUNT) + this.state.margin + "px"};
			return <div style={style}/>;
		}
	}
}

class FileContainer extends React.Component<{dir: Directory}, any> {
	public render(): ReactNode {
		return(
			<div
				className="Panel"
				style={{
					display: "block",
					textAlign: "left",
					width: "100%",
					height: "100%"
				}}
			>
				{this.props.dir.toReactNode()}
			</div>
		);
	}
}

export interface IFilesProps extends IPageProps {
	link: string;
	goBack: () => void;
	file: string;
	sha: string;
}

export interface IFilesState extends IPageState {
	loading: boolean;
	requestError: boolean;
	shaError: boolean;
}

export interface IReactDirectoryProps extends IFadeableElementProps{
	dir: Directory;
	level: number;
}

export interface IReactDirectoryState extends IFadeableElementState {
	expanded: boolean;
	margin: number;
}

export interface IReactFileProps extends IFadeableElementProps {
	file: File;
	level: number;
}

export interface IReactFileState extends IFadeableElementState {
	selected: boolean;
	margin: number;
}
