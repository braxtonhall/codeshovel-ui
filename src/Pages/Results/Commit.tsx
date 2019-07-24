import {FadeableElement, IFadeableElementProps, IFadeableElementState} from "../../FadeableElement";
import {Constants} from "../../Constants";
import {ReactNode} from "react";
import * as React from "react";
import {ICommitx} from "../../Types";

export class ReactCommit extends FadeableElement<IReactCommitProps, IReactCommitState> {
	protected readonly fadeOutTime: number = 300;
	private oldText: string;
	private newText: string;

	constructor(props: IReactCommitProps) {
		super(props);
		this.state = {onScreen: this.props.active, expanded: false};
		this.oldText = "";
		this.newText = "";
		this.setUpText();
		this.goToCommit = this.goToCommit.bind(this);
		this.mouseDown = this.mouseDown.bind(this);
		this.goToFileInCommit = this.goToFileInCommit.bind(this);
		this.toggleExpanded = this.toggleExpanded.bind(this);
		this.getBackgroundColour = this.getBackgroundColour.bind(this);
		this.getDate = this.getDate.bind(this);
	}

	private setUpText(): void {
		if (this.props.commit.diff !== undefined) {
			const lines: string[] = this.props.commit.diff.split('\n');
			for (const line of lines) {
				if (line.startsWith('@@')) {
					// Skip
				} else if (line.startsWith('\\ No newline at end of file')) {
					// Skip
				} else if (line.startsWith('+')) {
					this.newText = this.newText + "\n " + line.substring(1);
				} else if (line.startsWith('-')) {
					this.oldText = this.oldText + "\n " + line.substring(1);
				} else {
					this.newText = this.newText + "\n" + line;
					this.oldText = this.oldText + "\n" + line;
				}
			}
		}
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

	private toggleExpanded(): void {
		const state: IReactCommitState = Object.assign({}, this.state);
		state.expanded = !state.expanded;
		if (state.expanded) {
			// TODO not this
			setImmediate(() => {
				if (this.props.commit.diff) {
					/* eslint-disable */
					// @ts-ignore
					const diffDrawer = new Diff2HtmlUI({diff: "--- a/file.fake\n+++ b/file.fake\n" + this.props.commit.diff});
					diffDrawer.draw(`#${this.props.commit.commitName}`, {inputFormat: 'diff', showFiles: false, matching: 'lines', outputFormat: 'line-by-line'});
					diffDrawer.highlightCode(`#${this.props.commit.commitName}`);
				}
			});
		} else {
			const element = document.getElementById(this.props.commit.commitName);
			if (element) {
				element.innerHTML = "<div/>";
			}
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
					<div id={this.props.commit.commitName} style={{width: "90%", margin: "0 auto"}}/>
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
}
