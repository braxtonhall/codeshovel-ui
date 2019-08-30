import React, {ReactNode} from "react";
import {FadeableElement, IFadeableElementProps, IFadeableElementState} from "../FadeableElement";
import SmallButton from "../Buttons/SmallButton";

export default class TutorialPane extends FadeableElement<ITutorialPaneProps, ITutorialPaneState> {
	protected readonly fadeOutTime: number = 500;

	public constructor(props: ITutorialPaneProps) {
		super(props);
		this.state = {
			onScreen: this.props.active,
		};
	}

	private getSize(modifier: number = 1): string {
		return (0.01 * this.props.windowWidth * this.props.width * modifier) + "px";
	}

	public createReactNode(): ReactNode {
		const size: string = this.getSize();
		return (this.state.onScreen || this.props.active ?
				<div
					style={{
						top: this.props.top + "%",
						right: this.props.right + "%",
						height: size,
						width: size,
						color: this.props.active ? "rgb(255, 255, 255)" : "rgb(112, 111, 162)",
						backgroundColor: "rgb(112, 111, 162)",
						opacity: this.props.active ? 0.8 : 0,
						transition: this.fadeOutTime + "ms ease-in-out",
						position: "absolute",
						zIndex: 9999,
						pointerEvents: "none",
						alignItems: "center",
						justifyContent: "center",
						display: "flex"
					}}
				>
					<div
						style={{
							width: "90%",
							font: "100% \"Courier New\", Futura, sans-serif",
							fontSize: this.getSize(0.05),
							verticalAlign: "middle",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						{this.props.text}
					</div>
					<div style={{top: "20px", right: "20px", position: "absolute", pointerEvents: "auto"}}>
						<SmallButton
							height={15}
							width={15}
							left={0}
							backgroundSize={10}
							backgroundImage={`url(${process.env.PUBLIC_URL}/cross.png)`}
							onClick={this.props.dismissTutorial}
							bottom={0}
							shift={0}
							active={true}
						/>
					</div>
				</div> :
				<div/>
		);
	}
}

export interface ITutorialPaneProps extends IFadeableElementProps {
	text: string;
	width: number;
	windowWidth: number;
	dismissTutorial: () => void;
	top: number;
	right: number;
}

export interface ITutorialPaneState extends IFadeableElementState {

}