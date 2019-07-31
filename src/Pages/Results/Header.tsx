import {ICommitRowProps, ReactCommitRow} from "./CommitRow";
import {ReactNode} from "react";
import {IFadeableElementState} from "../../FadeableElement";
import {Constants} from "../../Constants";
import * as React from "react";

export class Header extends ReactCommitRow<IHeaderProps, IHeaderState> {

	constructor(props: IHeaderProps) {
		super(props);
		this.state = {
			onScreen: this.props.active,
		};
		this.setUpColours();
	}

	public createReactNode(): ReactNode {
		let height: number = Math.log(this.props.windowHeight) * Constants.COMMIT_ROW_HEIGHT;
		return (
			<div
				style={{
					margin: "0 auto",
					top: "3px",
					marginBottom: "3px",
					textAlign: "left",
					font: Constants.FONT,
					width: (this.props.windowWidth * 0.01 * Constants.COMMIT_ROW_WIDTH) + "px",
					overflow: "hidden",
					zIndex: 9999,
					transition: this.fadeOutTime + "ms ease-in-out",
					display: "grid",
					gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
					backgroundColor: "rgb(255, 255, 255)",
					position: "fixed",
					left: "50%",
					transform: "translate(-50%, 0)",
					color: "rgb(0,0,0)",
					height,
				}}
			>
				<div className="CommitRowCell" style={{fontSize: this.getFontSize("Date"), backgroundColor: `rgba(0, 0, 0, 0.${this.datec})`}}>
					Date
				</div>
				<div className="CommitRowCell" style={{fontSize: this.getFontSize("Author"), backgroundColor: `rgba(0, 0, 0, 0.${this.authc})`}}>
					Author
				</div>
				<div className="CommitRowCell" style={{fontSize: this.getFontSize("Type"), backgroundColor: `rgba(0, 0, 0, 0.${this.typec})`}}>
					Type
				</div>

				<div className="CommitRowCell" style={{fontSize: this.getFontSize("View123456"), backgroundColor: `rgba(0, 0, 0, 0.${this.comtc})`}}>
					View<br/>Commit
				</div>
				<div className="CommitRowCell" style={{fontSize: this.getFontSize("View123456"), backgroundColor: `rgba(0, 0, 0, 0.${this.filec})`}}>
					View<br/>File
				</div>
				<div className="CommitRowCell" style={{fontSize: this.getFontSize("View123456"), backgroundColor: `rgba(0, 0, 0, 0.${this.detlc})`}}>
					View<br/>Details
				</div>
			</div>
		);
	}
}

export interface IHeaderProps extends ICommitRowProps{

}

export interface IHeaderState extends IFadeableElementState {

}