import {FadeableElement, IFadeableElementProps, IFadeableElementState} from "../../FadeableElement";
import {Constants} from "../../Constants";
import {ReactNode} from "react";
import * as React from "react";
import {ICommitx} from "../../Types";

export class ReactCommit extends FadeableElement<IReactCommitProps, IReactCommitState> {
	protected readonly fadeOutTime: number = 300;
	private diffDeleter: any = undefined;
	private datec: string = "";
	private authc: string = "";
	private filec: string = "";
	private comtc: string = "";
	private detlc: string = "";
	private typec: string = "";

	constructor(props: IReactCommitProps) {
		super(props);
		this.state = {onScreen: this.props.active, expanded: false, diffVisible: false};
		this.setUpColours();
		this.goToCommit = this.goToCommit.bind(this);
		this.mouseDown = this.mouseDown.bind(this);
		this.goToFileInCommit = this.goToFileInCommit.bind(this);
		this.toggleExpanded = this.toggleExpanded.bind(this);
		this.getBackgroundColour = this.getBackgroundColour.bind(this);
		this.getDate = this.getDate.bind(this);
		this.getHeight = this.getHeight.bind(this);
		this.enableDiff = this.enableDiff.bind(this);
	}

	private setUpColours(): void {
		let temp = Math.floor(Math.random() * Constants.COMMIT_CELL_COLOUR_VARIANCE_PCT);
		this.datec = temp < 10 ? "0" + temp : "" + temp;
		temp = Math.floor(Math.random() * Constants.COMMIT_CELL_COLOUR_VARIANCE_PCT);
		this.authc = temp < 10 ? "0" + temp : "" + temp;
		temp = Math.floor(Math.random() * Constants.COMMIT_CELL_COLOUR_VARIANCE_PCT);
		this.filec = temp < 10 ? "0" + temp : "" + temp;
		temp = Math.floor(Math.random() * Constants.COMMIT_CELL_COLOUR_VARIANCE_PCT);
		this.comtc = temp < 10 ? "0" + temp : "" + temp;
		temp = Math.floor(Math.random() * Constants.COMMIT_CELL_COLOUR_VARIANCE_PCT);
		this.detlc = temp < 10 ? "0" + temp : "" + temp;
		temp = Math.floor(Math.random() * Constants.COMMIT_CELL_COLOUR_VARIANCE_PCT);
		this.typec = temp < 10 ? "0" + temp : "" + temp;
	}

	private goToCommit(): void {
		const baseUrl: string = this.props.repo.replace(".git", "");
		const link: string = `${baseUrl}/commit/${this.props.commit.commitName}`;
		if(baseUrl !== "") {
			window.open(link, "_blank");
		}
	}

	private goToFileInCommit(): void {
		console.log(this.props.repo);
		const baseUrl: string = this.props.repo.replace(".git", "");
		const link: string = `${baseUrl}/blob/${this.props.commit.commitName}/${this.props.commit.file}`;
		if(baseUrl !== "") {
			window.open(link, "_blank");
		}
	}

	private getChangeType(): string {
		let change = this.props.commit.type;
		if (change.startsWith("Ymultichange")) {
			change = "Ymultichange";
		}
		return Constants.CHANGE_TYPES[change];
	}

	private getBackgroundColour(): string {
		let change = this.props.commit.type;
		if (change.startsWith("Ymultichange")) {
			change = "Ymultichange";
		}
		return Constants.CHANGE_COLORS[change];
	}

	private mouseDown(): void {
		// const state: IReactCommitState = Object.assign({}, this.state);
		// state.margin = Constants.LIST_ELEMENT_NEW_LINE_PX_COUNT;
		// this.setState(state);
	}

	private getDate(): string {
		const date: number = Date.parse(this.props.commit.commitDate);
		if (isNaN(date)) {
			return "?";
		} else {
			return this.props.commit.commitDate.split(' ')[0];
		}
	}

	private getHeight(): number {
		const element: Element | null = document.getElementById(this.props.commit.commitName);
		if (element) {
			return Constants.COMMIT_ROW_HEIGHT + element.clientHeight;
		} else {
			return Constants.COMMIT_ROW_HEIGHT;
		}

	}

	private enableDiff(): void {
		if (this.state.expanded) {
			const state: IReactCommitState = Object.assign({}, this.state);
			state.diffVisible = true;
			this.setState(state);
		}
	}

	private toggleExpanded(): void {
		const state: IReactCommitState = Object.assign({}, this.state);
		state.expanded = !state.expanded;
		if (state.expanded) {
			// TODO not this
			if (this.props.commit.diff) {
				/* eslint-disable */
				// @ts-ignore
				const diffDrawer = new Diff2HtmlUI({diff: "--- a/file.fake\n+++ b/file.fake\n" + this.props.commit.diff});
				diffDrawer.draw(`#${this.props.commit.commitName}`, {inputFormat: 'diff', showFiles: false, matching: 'lines', outputFormat: 'line-by-line'});
				diffDrawer.highlightCode(`#${this.props.commit.commitName}`);
				if (this.diffDeleter) {
					clearTimeout(this.diffDeleter);
				}
				setTimeout(this.enableDiff, this.fadeOutTime);
			}
		} else {
			state.diffVisible = false;
			this.diffDeleter = setTimeout(() => {
				const element = document.getElementById(this.props.commit.commitName);
				if (element) {
					element.innerHTML = "<div/>";
				}
				this.diffDeleter = undefined;
				this.forceUpdate();
			}, this.fadeOutTime);
		}
		this.setState(state);
	}

	protected createReactNode(): ReactNode {
		return(
			<div
				style={{display: "block", alignItems: "center"}}
			>
				<div
					style={{
						margin: "0 auto",
						marginTop: "3px",
						marginBottom: "3px",
						textAlign: "left",
						// @ts-ignore
						height: this.getHeight(),
						backgroundColor: this.getBackgroundColour(),
						font: "100% \"Courier New\", Futura, sans-serif",
						width: (Constants.COMMIT_ROW_WIDTH + (this.state.expanded ? Constants.COMMIT_WIDTH_MODIFIER : 0)) + "px",
						overflow: "hidden",
						zIndex: 9999,
						transition: this.fadeOutTime + "ms ease-in-out",
					}}
					onMouseDown={this.mouseDown}
				>
					<div
						style={{
							margin: "0 auto",
							width: Constants.COMMIT_ROW_WIDTH,
							// display: "inline-flex",
							display: "grid",
							gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr"
						}}
					>
						<div className="CommitRowCell" style={{fontSize: "70%", backgroundColor: `rgba(255, 255, 255, 0.${this.datec})`}}>
							{this.getDate()}
						</div>
						<div className="CommitRowCell" style={{backgroundColor: `rgba(255, 255, 255, 0.${this.authc})`}}>
							{this.props.commit.commitAuthor}
						</div>
						<div className="CommitRowCell" style={{backgroundColor: `rgba(255, 255, 255, 0.${this.typec})`}}>
							{this.getChangeType()}
						</div>
						{this.props.repo.replace(".git", "") !== "" ?
							<div className="CommitRowCell" onClick={this.goToCommit} style={{backgroundColor: `rgba(255, 255, 255, 0.${this.comtc})`}}>
								View<br/>{this.props.commit.commitName.substring(34)}
							</div> : <div/>
						}
						{this.props.commit.file && this.props.repo.replace(".git", "") !== "" ?
							<div className="CommitRowCell" onClick={this.goToFileInCommit} style={{backgroundColor: `rgba(255, 255, 255, 0.${this.filec})`}}>
								View<br/>File
							</div> : <div/>
						}
						<div className="CommitRowCell" onClick={this.toggleExpanded} style={{backgroundColor: `rgba(255, 255, 255, 0.${this.detlc})`}}>
							Details
						</div>
					</div>
					<div id={this.props.commit.commitName} style={{width: "90%", margin: "0 auto", opacity: this.state.diffVisible ? 1 : 0, transition: this.fadeOutTime + "ms ease-in-out"}}/>
				</div>
			</div>
		);
	}
}

export interface IReactCommitProps extends IFadeableElementProps {
	commit: ICommitx;
	repo: string;
}

export interface IReactCommitState extends IFadeableElementState {
	expanded: boolean;
	diffVisible: boolean;
}
