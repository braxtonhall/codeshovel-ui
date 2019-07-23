import {FadeableElement, IFadeableElementProps, IFadeableElementState} from "../FadeableElement";
import {ReactNode} from "react";
import React from "react";

export default class CopyRawButton extends FadeableElement<ICopyRawProps, ICopyRawState> {
	protected readonly fadeOutTime: number = 500;

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
							width: "30px",
							position: "absolute",
							bottom: "5px",
							left: "40px",
							backgroundColor: "rgb(183, 166, 108)",
							opacity: this.props.active ? 1 : 0,
							transition: this.fadeOutTime + "ms ease-in-out",
							backgroundImage: "url(/clipboard.png)",
							backgroundSize: "15px",
						}}
						onClick={this.props.handleClick}
					>

					</div> : <div className="BackgroundImage"
								  style={{position: "absolute", bottom: "5px", left: "40px", opacity: 0,}}/>

				}
				{this.state.onScreen || this.props.active ?
					<div
						style={{
							height: "30px",
							width: "300px",
							position: "absolute",
							bottom: "5px",
							left: "75px",
							backgroundColor: "rgb(183, 166, 108)",
							opacity: this.props.active && this.props.displayNotification ? 1 : 0,
							transition: this.fadeOutTime + "ms ease-in-out",
							font: "15px \"Courier New\", Futura, sans-serif",
							textAlign: "center",
							color: "rgb(0, 0, 0)",
							whiteSpace: "nowrap",
						}}
					>
						Raw Output Copied to Clipboard!
					</div> : <div style={{position: "absolute", bottom: "5px", left: "75px", opacity: 0,}}/>
				}
			</div>
		);
	}
}

export interface ICopyRawProps extends IFadeableElementProps{
	handleClick: () => void,
	displayNotification: boolean,
}

export interface ICopyRawState extends IFadeableElementState{

}