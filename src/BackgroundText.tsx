import * as React from "react";
import {ReactNode} from "react";
import {Pages} from "./Enums";
import {IMethodTransport} from "./Types";

export class BackgroundText extends React.Component<IBackgroundTextProps, {}> {
	private readonly fadeOutTime: number = 700;
	public render(): ReactNode {
		return(
			<div>
				<div
					style={{
						position: "absolute",
						top: "15%",
						left: "2%",
						font: "900% \"Courier New\", Futura, sans-serif",
						textAlign: "left",
						fontStyle: "italic",
						opacity: this.props.page >= Pages.FILES ? 1 : 0,
						filter: "blur(12px)",
						transition: this.fadeOutTime + "ms ease-in-out",
						// animation: `Fade-${this.props.active ? "In" : "Out"} ${this.fadeOutTime}ms ease-in-out`,
					}}
				>
					{(this.props.repo.split("/").pop() as string).replace(".git", "")}
				</div>
				<div
					style={{
						position: "absolute",
						top: "57%",
						left: "10%",
						font: "800% \"Courier New\", Futura, sans-serif",
						textAlign: "left",
						fontStyle: "italic",
						opacity: this.props.page >= Pages.FILES ? 1 : 0,
						filter: "blur(12px)",
						transition: this.fadeOutTime + "ms ease-in-out",
						// animation: `Fade-${this.props.active ? "In" : "Out"} ${this.fadeOutTime}ms ease-in-out`,
					}}
				>
					{this.props.file.split("/").pop()}
				</div>
				<div
					style={{
						position: "absolute",
						top: "80%",
						left: "60%",
						font: "650% \"Courier New\", Futura, sans-serif",
						textAlign: "left",
						fontStyle: "italic",
						opacity: this.props.page >= Pages.FILES ? 1 : 0,
						filter: "blur(12px)",
						transition: this.fadeOutTime + "ms ease-in-out",
						// transition: this.fadeOutTime + "ms ease-in-out",
						// animation: `Fade-${this.props.active ? "In" : "Out"} ${this.fadeOutTime}ms ease-in-out`,
					}}
				>
					{this.props.sha === "HEAD" ? "" : this.props.sha}
				</div>
				<div
					style={{
						position: "absolute",
						top: "40%",
						left: "35%",
						font: "700% \"Courier New\", Futura, sans-serif",
						textAlign: "left",
						fontStyle: "italic",
						opacity: this.props.page >= Pages.METHODS ? 1 : 0,
						filter: "blur(12px)",
						transition: this.fadeOutTime + "ms ease-in-out",
					}}
				>
					{this.props.method.methodName}
				</div>
			</div>
		);
	}
}

export interface IBackgroundTextProps {
	page: Pages;
	file: string;
	method: IMethodTransport;
	sha: string;
	repo: string;
}
