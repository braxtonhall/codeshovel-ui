import React, {ReactNode} from "react";
import {FadeableElement, IFadeableElementProps, IFadeableElementState} from "../FadeableElement";

export default class LoadingPane extends FadeableElement<ILoadingPaneProps, ILoadingPaneState> {
	protected readonly fadeOutTime: number = 500;

	public constructor(props: ILoadingPaneProps) {
		super(props);
		this.state = {onScreen: this.props.active};
	}

	public createReactNode(): ReactNode {
		return (this.state.onScreen || this.props.active ?
			<div
				style={{
					textAlign: "center",
					verticalAlign: "center",
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					height: this.props.size.height + "%",
					width: this.props.size.width + "%",
					color: "rgb(0, 0, 0)",
					backgroundColor: "rgb(183, 166, 108)",
					opacity: this.props.active ? 1 : 0,
					transition: this.fadeOutTime + "ms ease-in-out",
					// animation: `Pulse infinite 1s ease-in-out`,
				}}
			>
				<div
					style={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						font: "100% \"Courier New\", Futura, sans-serif",
					}}
				>
					{this.props.text}
				</div>
			</div> :
			<div
				style={{
					position: "absolute",
					top: "50%",
					left: "50%",
					opacity: 0,
					transform: "translate(-50%, -50%)",
					color: "rgb(0, 0, 0)",
				}}
			/>
		);
	}
}

export interface ILoadingPaneProps extends IFadeableElementProps {
	text: string;
	size: {height: number, width: number};
}

export interface ILoadingPaneState extends IFadeableElementState {

}