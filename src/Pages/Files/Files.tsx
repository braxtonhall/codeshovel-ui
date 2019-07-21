import * as React from "react";
import {FormEvent, ReactNode} from "react";
import {IPageProps, IPageState, Page} from "../Page";
import {ArgKind, Key, Pages} from "../../Enums";
import ErrorPane from "../../Panes/ErrorPane";
import Button from "react-bootstrap/Button";
import {Constants} from "../../Constants";
import Form from "react-bootstrap/Form";
import {Directory} from "./Directory";

export class Files extends Page<IFilesProps, IFilesState> {
	private readonly shaPlaceholder: string = Constants.FILE_SHA_PLACEHOLDER_TEXT;
	private readonly shaErrorText: string = Constants.FILE_SHA_ERROR_TEXT;
	protected readonly page: Pages = Pages.FILES;

	private link: string;
	private sha: string;
	private root: Directory;
	private content: string[];

	public constructor(props: IFilesProps) {
		super(props);
		this.state = {
			onScreen: this.props.active,
			loading: false,
			shaError: false,
		};
		this.link = "";
		this.sha = "HEAD";
		this.root = new Directory(".", [], this.proceedToNextPageAndUpdateSelected, this.forceUpdate, true);
		this.content = [];
		this.closeShaError = this.closeShaError.bind(this);
		this.buildDirectory = this.buildDirectory.bind(this);
		this.proceedToNextPageAndUpdateSelected = this.proceedToNextPageAndUpdateSelected.bind(this);
		this.handleRefresh = this.handleRefresh.bind(this);
		this.handleShaEnter = this.handleShaEnter.bind(this);
		this.handleKey = this.handleKey.bind(this);
		this.forceUpdate = this.forceUpdate.bind(this);
	}

	public componentDidMount(): void {
		document.addEventListener('keydown', this.handleKey);
	}

	public componentWillUnmount(): void {
		document.removeEventListener('keydown', this.handleKey);
	}

	private handleKey(event: KeyboardEvent): void {
		function isArrowKey(code: string): boolean {
			return code === Key.UP || code === Key.DOWN || code === Key.LEFT || code === Key.RIGHT;
		}

		if (this.props.active && isArrowKey(event.code)) {
			event.preventDefault();
			this.root.moveHighlight(event.code as Key);
			this.forceUpdate();
		}
	}

	protected handleNext(): void {
		if (this.props.file !== "") {
			this.props.proceedToPage(Pages.METHODS);
		}
	}

	private handleRefresh(): void {
		const shaElement: HTMLInputElement = (document.getElementById("shaInput") as HTMLInputElement);
		if (shaElement && shaElement.value) {
			this.props.proceedWithUpdate(Pages.FILES, shaElement.value, ArgKind.SHA);
		} else {
			const state: IFilesState = Object.assign({}, this.state);
			state.shaError = true;
			this.setState(state);
		}
	}

	private proceedToNextPageAndUpdateSelected(path: string): void {
		this.props.proceedWithUpdate(Pages.METHODS, path.replace(/^\.\//, ""), ArgKind.FILE);
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

	private buildDirectory(files: string[]): void {
		this.content = files;
		this.root = new Directory(".", files, this.proceedToNextPageAndUpdateSelected, this.forceUpdate, true);
	}

	public createReactNode(): ReactNode {
		if (this.content !== this.props.content) {
			this.buildDirectory(this.props.content);
		}
		return (
			<div>
				<div>
					{this.state.onScreen || this.props.active ?
						<div
							style={{
								position: "absolute",
								right: "1%",
								top: "58%",
								font: "200% \"Courier New\", Futura, sans-serif",
								textAlign: "right",
								fontStyle: "italic",
								opacity: this.props.active ? 1 : 0,
								transition: `${this.fadeOutTime}ms ease-in-out`,
							}}
						>
							Select a<br/>file.{'\u00A0\u00A0'}
						</div> : <div style={{right: "1%", top: "58%", font: "200% \"Courier New\", Futura, sans-serif", opacity: 0}}/>
					}
				</div>
				<div>
					{// this.state.onScreen || this.props.active ?
						<div
							style={{
								position: "fixed",
								overflowY: "scroll",
								height: "100%",
								width: "100%",
								top: "50%",
								left: "50%",
								transform: this.chooseTransform(),
								opacity: this.props.active ? 0.8 : 0,
								transition: `${this.fadeOutTime}ms ease-in-out`,
							}}
						>
							<FileContainer dir={this.root}/>
						</div>// : <div style={{top: "50%", left: "50%", transform: this.chooseTransform()}}/>
					}
				</div>
				<div>
					{this.state.onScreen || this.props.active ?
						<div
							style={{
								position: "absolute",
								right: "0",
								bottom: "0",
								width: "28%",
								height: "34%",
								opacity: this.props.active ? 1 : 0,
								transition: this.fadeOutTime + "ms ease-in-out",
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
									position: "absolute",
									bottom: "10%",
									right: "2%",
									width: "100%",
								}}
							>
								<Form onSubmit={this.handleShaEnter}>
									<Form.Control id="shaInput" size="sm" type="text" placeholder={this.shaPlaceholder}/>
								</Form>
								<Button style={{marginTop: "1%", marginLeft: "auto", marginRight: "5%", position: "relative", float: "right",}} variant="primary" onClick={this.handleRefresh} disabled={false}>Refresh</Button>
							</div>
						</div> : <div style={{opacity: 0}}/>
					}
				</div>
				<div>
					{this.state.onScreen || this.props.active ?
						<div>
							<ErrorPane text={this.shaErrorText} active={this.state.shaError && this.props.active} size={{height: 30, width: 72}} exit={this.closeShaError}/>
						</div> : <div/>
					}
				</div>
			</div>
		);
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
	content: string[];
	file: string;
	proceedWithUpdate: (page: Pages, arg: any, kind: ArgKind) => void;
}

export interface IFilesState extends IPageState {
	loading: boolean;
	shaError: boolean;
}
