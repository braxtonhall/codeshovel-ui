import {FadeableElement, IFadeableElementProps, IFadeableElementState} from "../../FadeableElement";
import {ReactNode} from "react";
import * as React from "react";
import {ICommit, IHistoryTransport} from "../../Types";
import {ReactCommit} from "./Commit";

export class History {
	private commits: ICommit[];

	constructor(history: IHistoryTransport) {
		this.commits = History.buildCommits(history);
	}

	private static buildCommits(history: IHistoryTransport): ICommit[] {
		return Array.from(Object.values(history))
			.sort((a: ICommit, b: ICommit): number => {
				const aDate: number = Date.parse(a.commitDate);
				const bDate: number = Date.parse(b.commitDate);
				if (!(isNaN(aDate) || isNaN(bDate))) {
					if (aDate < bDate) {
						return 1;
					} else if (aDate > bDate) {
						return -1;
					} else {
						return 0;
					}
				} else if (!isNaN(aDate)) {
					return 1;
				} else if (!isNaN(bDate)) {
					return -1;
				} else {
					return 0;
				}
			});
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
