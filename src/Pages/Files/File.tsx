import {FadeableElement, IFadeableElementProps, IFadeableElementState} from "../../FadeableElement";
import {Constants} from "../../Constants";
import {ReactNode} from "react";
import * as React from "react";

export class File {
	private readonly name: string;
	private readonly alerter: (name: string) => void;
	private highlight: boolean;

	constructor(name: string, alerter: (name: string) => void) {
		this.name = name;
		this.alerter = alerter;
		this.highlight = false;
		this.tellParent = this.tellParent.bind(this);
	}

	public shouldHighlightThis(): boolean {
		return this.highlight;
	}

	public tellParent(): void {
		this.alerter(this.name);
	}

	public getName(): string {
		return this.name;
	}

	public removeHighlight(): void {
		this.highlight = false;
	}

	public addHighlight(): void {
		this.highlight = true;
	}
}

export class ReactFile extends FadeableElement<IReactFileProps, IReactFileState> {
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

	protected createReactNode(): ReactNode {
		const style = {marginLeft: (this.props.level * Constants.LIST_ELEMENT_NEW_LINE_PX_COUNT) + this.state.margin + "px"};
		return(this.state.onScreen || this.props.active ?
				<div
					style={{display: "block"}}
				>
					<div
						style={{
							marginLeft: (this.props.level * Constants.LIST_ELEMENT_NEW_LINE_PX_COUNT) + this.state.margin + "px",
							animation: `${this.props.active ? "Expand" : "Contract"}  ${this.fadeOutTime}ms ease-in-out`,
							marginTop: "3px",
							marginBottom: "3px",
							backgroundColor: this.props.highlight ? "rgb(124, 0, 6)" : "rgb(124, 124, 124)",
							height: this.props.active ? "40px" : "0",
							font: "100% \"Courier New\", Futura, sans-serif",
							width: (650 - Constants.LIST_ELEMENT_NEW_LINE_PX_COUNT * 1.5) + "px",
							overflow: "hidden",
							zIndex: 9999,
							transition: this.fadeOutTime + "ms ease-in-out",
						}}
						onClick={this.handleClick}
						onMouseDown={this.mouseDown}
					>
						{this.props.file.getName()}
					</div>

				</div> :  <div style={style}/>
		);
	}
}

export interface IReactFileProps extends IFadeableElementProps {
	file: File;
	level: number;
	highlight: boolean;
}

export interface IReactFileState extends IFadeableElementState {
	selected: boolean;
	margin: number;
}
