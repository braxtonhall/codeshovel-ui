import {FadeableElement, IFadeableElementProps, IFadeableElementState} from "../../FadeableElement";
import {Constants} from "../../Constants";
import {ReactNode} from "react";
import * as React from "react";
import {ICommitx} from "../../Types";

export class ReactCommit extends FadeableElement<IReactCommitProps, IReactCommitState> {
	protected readonly fadeOutTime: number = 300;
	private diffDeleter: any = undefined;

	constructor(props: IReactCommitProps) {
		super(props);
		this.state = {onScreen: this.props.active, expanded: false, diffVisible: false};
		this.goToCommit = this.goToCommit.bind(this);
		this.mouseDown = this.mouseDown.bind(this);
		this.goToFileInCommit = this.goToFileInCommit.bind(this);
		this.toggleExpanded = this.toggleExpanded.bind(this);
		this.getBackgroundColour = this.getBackgroundColour.bind(this);
		this.getDate = this.getDate.bind(this);
		this.getHeight = this.getHeight.bind(this);
		this.enableDiff = this.enableDiff.bind(this);
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
			return this.props.commit.commitDate;
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
						// marginLeft: (this.props.level * Constants.LIST_ELEMENT_NEW_LINE_PX_COUNT) + this.state.margin + "px",
						// animation: `${this.props.active ? "Expand" : "Contract"}  ${this.fadeOutTime}ms ease-in-out`,
						margin: "0 auto",
						marginTop: "3px",
						marginBottom: "3px",
						textAlign: "left",
						// @ts-ignore
						height: this.getHeight(),
						backgroundColor: this.getBackgroundColour(),
						// height: "40px", // this.props.active ? "40px" : "0",
						font: "100% \"Courier New\", Futura, sans-serif",
						width: (Constants.COMMIT_ROW_WIDTH + (this.state.expanded ? Constants.COMMIT_WIDTH_MODIFIER : 0)) + "px",
						overflow: "hidden",
						zIndex: 9999,
						transition: this.fadeOutTime + "ms ease-in-out",
					}}
					onMouseDown={this.mouseDown}
					onClick={this.toggleExpanded}
				>
					<div>
						{this.getChangeType() + (this.props.commit.commitAuthor ? " by " + this.props.commit.commitAuthor : "")}
					</div>
					<div id={this.props.commit.commitName} style={{width: "90%", margin: "0 auto", opacity: this.state.diffVisible ? 1 : 0, transition: this.fadeOutTime + "ms ease-in-out"}}/>
					<div
						style={{
							fontSize: "50%",
							textAlign: "right",
						}}
						onClick={this.goToCommit}
					>
						{this.props.commit.commitName}
					</div>
					{this.props.commit.file && this.props.repo.replace(".git", "") !== "" ?
						<div
							style={{
								fontSize: "50%",
								textAlign: "right",
							}}
							onClick={this.goToFileInCommit}
						>
							Visit
						</div> : <div/>
					}
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
