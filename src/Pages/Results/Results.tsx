import * as React from "react";
import {ReactNode} from "react";
import {IPageProps, IPageState, Page} from "../Page";
import {Pages} from "../../Enums";
import {IHistoryTransport} from "../../Types";
import {History, ReactHistory} from "./History";

export class Results extends Page<IHistoryProps, IHistoryState> {
	protected readonly page: Pages = Pages.RESULTS;
	private content: IHistoryTransport;
	private history: History;

	public constructor(props: IHistoryProps) {
		super(props);
		this.state = {
			onScreen: this.props.active,
		};
		this.history = new History({});
		this.content = {};
		this.buildHistory = this.buildHistory.bind(this);
	}

	protected handleNext(): void {
		this.props.proceedToPage(Pages.ABOUT);
	}

	private buildHistory(history: IHistoryTransport): void {
		this.content = history;
		this.history = new History(history);
	}

	public createReactNode(): ReactNode {
		if (this.content !== this.props.content) {
			this.buildHistory(this.props.content);
		}
		return(
			<div>
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
					<ReactHistory history={this.history} active={this.props.active}/>
				</div>
			</div>
		);
	}
}

export interface IHistoryProps extends IPageProps {
	content: IHistoryTransport;
}

export interface IHistoryState extends IPageState {

}
