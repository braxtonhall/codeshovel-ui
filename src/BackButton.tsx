import React, {ReactNode} from "react";
import {FadeableElement, IFadeableElementProps, IFadeableElementState} from "./FadeableElement";

export default class BackButton extends FadeableElement<IBackButtonProps, IBackButtonState> {
	protected readonly fadeOutTime: number = 500;

	public constructor(props: IBackButtonProps) {
		super(props);
		this.state = {
			onScreen: this.props.active,
		};
	}

	protected createReactNode(): ReactNode {
		return (this.state.onScreen || this.props.active ?
			<div
				className="BackgroundImage"
				style={{
					height: "30px",
					width: "30px",
					position: "absolute",
					bottom: "5px",
					left: "5px",
					backgroundColor: "rgb(183, 166, 108)",
					opacity: this.props.active ? 1 : 0,
					transition: this.fadeOutTime + "ms ease-in-out",
					backgroundImage: "url(/left.png)",
					backgroundSize: "15px",
				}}
				onClick={this.props.goBack}
			/> : <div className="BackgroundImage" style={{position: "absolute", bottom: "5px", left: "5px", opacity: 0,}}/>
		);
	}
}

export interface IBackButtonProps extends IFadeableElementProps{
	goBack: () => void,
}

export interface IBackButtonState extends IFadeableElementState{

}