import {FadeableElement, IFadeableElementProps, IFadeableElementState} from "../../FadeableElement";
import {Constants} from "../../Constants";
import {ReactNode} from "react";
import * as React from "react";
import {ICommit} from "../../Types";

export class ReactCommit extends FadeableElement<IReactCommitProps, IReactCommitState> {
	protected readonly fadeOutTime: number = 300;

	constructor(props: IReactCommitProps) {
		super(props);
		this.state = {onScreen: this.props.active};
		this.handleClick = this.handleClick.bind(this);
		this.mouseDown = this.mouseDown.bind(this);
	}

	private handleClick(): void {
		// setImmediate(this.props.file.tellParent);
		// const state: IReactFileState = Object.assign({}, this.state);
		// state.margin = 0;
		// this.setState(state);
	}

	private mouseDown(): void {
		// const state: IReactFileState = Object.assign({}, this.state);
		// state.margin = Constants.LIST_ELEMENT_NEW_LINE_PX_COUNT;
		// this.setState(state);
	}

	protected createReactNode(): ReactNode {
		// const style = {marginLeft: Constants.LIST_ELEMENT_NEW_LINE_PX_COUNT + "px"};
		return(// this.state.onScreen || this.props.active ?
				<div
					style={{display: "block"}}
				>
					<div
						style={{
							// marginLeft: (this.props.level * Constants.LIST_ELEMENT_NEW_LINE_PX_COUNT) + this.state.margin + "px",
							// animation: `${this.props.active ? "Expand" : "Contract"}  ${this.fadeOutTime}ms ease-in-out`,
							marginTop: "3px",
							marginBottom: "3px",
							backgroundColor: "rgb(124, 124, 124)",
							height: "40px", // this.props.active ? "40px" : "0",
							font: "100% \"Courier New\", Futura, sans-serif",
							width: (650 - Constants.LIST_ELEMENT_NEW_LINE_PX_COUNT * 1.5) + "px",
							overflow: "hidden",
							zIndex: 9999,
							transition: this.fadeOutTime + "ms ease-in-out",
						}}
						onClick={this.handleClick}
						onMouseDown={this.mouseDown}
					>
						{this.props.commit.type}
					</div>
				</div>// :  <div style={style}/>
		);
	}
}

export interface IReactCommitProps extends IFadeableElementProps {
	commit: ICommit;
}

export interface IReactCommitState extends IFadeableElementState {

}
