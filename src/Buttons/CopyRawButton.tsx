import {FadeableElement, IFadeableElementProps, IFadeableElementState} from "../FadeableElement";
import {ReactNode} from "react";
import React from "react";
import {Constants} from "../Constants";

export default class CopyRawButton extends FadeableElement<ICopyRawProps, ICopyRawState> {
	protected readonly fadeOutTime: number = 400;

	public constructor(props: ICopyRawProps) {
		super(props);
		this.state = {
			onScreen: this.props.active,
		};
	}

	protected createReactNode(): ReactNode {
		return (
			<div>
				{this.state.onScreen || this.props.active ?
					<div
						className="BackgroundImage"
						style={{
							height: "30px",
							width: "180px",
							position: "absolute",
							bottom: "5px",
							left: (this.props.shift + 40) +"px",
							font: Constants.FONT,
							color: "rgb(0, 0, 0)",
							backgroundColor: this.props.displayNotification ? "rgb(124, 203, 126)" : "rgb(183, 166, 108)",
							opacity: this.props.active ? 1 : 0,
							transition: this.fadeOutTime + "ms ease-in-out",
							backgroundImage: "url(/clipboard.png)",
							backgroundSize: "15px",
							textAlign: "right",
							padding: "0 15px",
							backgroundPosition: "10px 3.5px",
						}}
						onClick={this.props.handleClick}
					>
						Copy JSON
					</div> :
					<div className="BackgroundImage"
						 style={{
						 	 position: "absolute",
							 bottom: "5px",
							 opacity: 0,
							 textAlign: "right",
							 padding: "0 15px",
							 backgroundPosition: "10px 3.5px",
							 color: "rgb(0, 0, 0)",
							 left: (this.props.shift + 40) +"px",
						 }}
					/>

				}
			</div>
		);
	}
}

export interface ICopyRawProps extends IFadeableElementProps{
	handleClick: () => void;
	displayNotification: boolean;
	shift: number;
}

export interface ICopyRawState extends IFadeableElementState{

}