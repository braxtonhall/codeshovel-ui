import * as React from "react";
import {FormEvent, ReactNode} from "react";
import {IPageProps, IPageState, Page} from "../Page";
import {ArgKind, Pages} from "../../Enums";
import * as rp from "request-promise-native";
import ErrorPane from "../../Panes/ErrorPane";
import Button from "react-bootstrap/Button";
import {Constants} from "../../Constants";
import LoadingPane from "../../Panes/LoadingPane";
import Form from "react-bootstrap/Form";
import {Directory} from "./Directory";

export class Files extends Page<IFilesProps, IFilesState> {
	private readonly requestErrorText: string = Constants.FILE_REQUEST_ERROR_TEXT;
	private readonly loadingText: string = Constants.FILE_LOADING_TEXT;
	private readonly shaPlaceholder: string = Constants.FILE_SHA_PLACEHOLDER_TEXT;
	private readonly shaErrorText: string = Constants.FILE_SHA_ERROR_TEXT;
	protected readonly page: Pages = Pages.FILES;

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

	protected updateContent(): void {
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

	public createReactNode(): ReactNode {
		// setImmediate(this.updateContent);
		// if (this.state.onScreen || this.props.active) {
		// 	setImmediate(this.setOnScreen);
		// }
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
					{this.state.onScreen || this.props.active ?
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
							<FileContainer dir={this.content}/>
						</div> : <div style={{top: "50%", left: "50%", transform: this.chooseTransform()}}/>
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
							<LoadingPane text={this.loadingText} active={this.state.loading && this.props.active} size={{height: 30, width: 72}}/>
							<ErrorPane text={this.requestErrorText} active={this.state.requestError && this.props.active} size={{height: 30, width: 72}} exit={this.handleCloseRequestError}/>
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
