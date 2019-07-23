import {FadeableElement, IFadeableElementProps, IFadeableElementState} from "../../FadeableElement";
import {ReactNode} from "react";
import * as React from "react";
import {IChange, ICommit, ICommitx, IHistoryTransport} from "../../Types";
import {ReactCommit} from "./Commit";

export class History {
	private commits: ICommitx[];

	constructor(history: IHistoryTransport, startFile: string) {
		this.commits = History.buildCommits(history, startFile);
	}

	private static buildCommits(history: IHistoryTransport, startFile: string): ICommitx[] {
		const commits: ICommitx[] = Array.from(Object.values(history)).slice();
		let file: string | undefined = startFile;
		for (const commit of commits) {
			commit["file"] = file;
			if (commit.type === "Yfilerename" || commit.type === "Ymovefromfile") {
				file = commit.extendedDetails.oldPath;
			} else if (commit.type.startsWith("Ymultichange") &&
				(commit.type.includes("Yfilerename") || commit.type.includes("Ymovefromfile"))) {
				const subChanges: IChange[] = commit.subchanges ? commit.subchanges : [];
				for (const subChange of subChanges) {
					if (subChange.type === "Yfilerename" || subChange.type === "Ymovefromfile") {
						file = subChange.extendedDetails.oldPath;
						break;
					}
				}

			}
		}
		return commits;
	}

	public getCommits(): ICommit[] {
		return this.commits.slice();
	}
}

export class ReactHistory extends FadeableElement<IReactHistoryProps, IReactHistoryState> {
	protected readonly fadeOutTime: number = 300;


	constructor(props: IReactHistoryProps) {
		super(props);
		this.state = {onScreen: this.props.active};
		this.handleClick = this.handleClick.bind(this);
		// this.mouseDown = this.mouseDown.bind(this);
	}

	private handleClick(): void {
		// setImmediate(this.props.history.tellParent);
		// const state: IReactHistoryState = Object.assign({}, this.state);
		// state.margin = 0;
		// this.setState(state);
	}

	// private mouseDown(): void {
	// 	const state: IReactHistoryState = Object.assign({}, this.state);
	// 	state.margin = Constants.LIST_ELEMENT_NEW_LINE_PX_COUNT;
	// 	this.setState(state);
	// }

	// private buildCommits(history: IHistoryTransport)

	protected createReactNode(): ReactNode {
		return(
			<div
				className="Panel"
				style={{
					display: "block",
					width: "100%",
					height: "100%"
				}}
			>
				{
					this.props.history.getCommits().map((commit: ICommit, i: number) => {
						return <ReactCommit commit={commit} key={i} active={this.props.active} repo={this.props.repo}/>;
					})
				}
			</div>
		);
	}
}

export interface IReactHistoryProps extends IFadeableElementProps {
	history: History;
	repo: string;
}

export interface IReactHistoryState extends IFadeableElementState {

}
