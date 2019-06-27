import {FadeableElement, IFadeableElementProps, IFadeableElementState} from "../../FadeableElement";
import {IMethodTransport} from "../../Types";
import {Constants} from "../../Constants";
import {ReactNode} from "react";
import * as React from "react";

export class Method extends FadeableElement<IReactMethodProps, IReactMethodState> {
	protected readonly fadeOutTime: number = Constants.METHODS_METHOD_ANIMATE_TIME;
	protected readonly marginModifier: number;
	private turnedOn: boolean;

	constructor(props: IReactMethodProps) {
		super(props);
		const inSearch: boolean = this.props.method.longName.includes(this.props.search);
		let marginModifier: number = Math.floor(Math.random() * Constants.METHODS_MAX_INDENT_UNIT_COUNT);
		marginModifier = marginModifier * Constants.METHODS_INDENT_UNIT_PX;
		marginModifier = marginModifier + this.props.index * Constants.METHODS_INDENT_UNIT_PX;
		this.marginModifier = marginModifier;
		this.state = {
			onScreen: this.props.active && inSearch,
			margin: this.marginModifier,
		};
		this.turnedOn = false;
		this.handleClick = this.handleClick.bind(this);
		this.mouseDown = this.mouseDown.bind(this);
		this.tellParent = this.tellParent.bind(this);
	}

	private handleClick(): void {
		if (this.props.active) {
			setImmediate(this.tellParent);
		}
		const state: IReactMethodState = Object.assign({}, this.state);
		state.margin = this.marginModifier;
		this.setState(state);
	}

	private mouseDown(): void {
		const state: IReactMethodState = Object.assign({}, this.state);
		state.margin = this.marginModifier + Constants.LIST_ELEMENT_NEW_LINE_PX_COUNT;
		this.setState(state);
	}

	private tellParent(): void {
		this.props.tellParent(this.props.method);
	}

	public render(): ReactNode {
		const style = {display: "inline-block"};
		const animation: string = this.turnedOn ? "" : `Expand ${this.fadeOutTime}ms ease-in-out`;
		if (!this.turnedOn) {
			this.turnedOn = true;
		}
		return (
			<div
				style={{
					marginLeft: this.state.margin +  "px",
					marginTop: this.props.active ? "3px" : "0",
					marginBottom: this.props.active ? "3px" : "1px",
					backgroundColor: "rgb(124, 124, 124)",
					height: this.props.active ? "40px" : "8px",
					font: (this.props.active ? 100 : 12) + "% \"Courier New\", Futura, sans-serif",
					width: "650px",
					overflow: "hidden",
					transition: this.fadeOutTime + "ms ease-in-out",
					opacity: this.props.active ? 1 : 0.5,
					animation,
				}}
				onClick={this.handleClick}
				onMouseDown={this.mouseDown}
			>
				{
					this.props.search === "" || !this.props.active ? this.props.method.longName : this.props.method.longName.split(this.props.search).flatMap(
						(s, i, list) => list.length - 1 !== i ? [<div key={2 * i} style={style}>{s}</div>, <code key={2 * i + 1} style={style}>{this.props.search}</code>] : <div key={2 * i} style={style}>{s}</div>,
					)
				}
			</div>
		);
	}
}

export interface IReactMethodProps extends IFadeableElementProps {
	method: IMethodTransport;
	search: string;
	tellParent: (method: {longName: string, startLine: number, methodName: string}) => void;
	index: number;
}

export interface IReactMethodState extends IFadeableElementState {
	margin: number;
}