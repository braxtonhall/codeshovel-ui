import {IPageProps, IPageState, Page} from "./Page";
import {Changes, Pages} from "../Enums";
import {ReactNode} from "react";
import * as React from "react";

export class About extends Page<IAboutProps, IAboutState> {
	protected readonly page = Pages.ABOUT;

	constructor(props: IAboutProps) {
		super(props);
		this.state = {
			onScreen: this.props.active,
		}
	}

	protected handleNext(): void {

	}

	protected createReactNode(): ReactNode {
		return (
			<div style={{
				position: "absolute",
				top: "50%",
				left: "50%",
				width: "100%",
				height: "100%",
				transform: this.chooseTransform(),
				opacity: this.props.active ? 1 : 0,
				transition: `${this.fadeOutTime}ms ease-in-out`,
				textAlign: "center",
				display: "flex",
				alignItems: "center",
				backgroundColor: "blue"
			}}>

			</div>
		);
	}
}

export interface IAboutProps extends IPageProps {
	windowWidth: number;
	windowHeight: number;
}

export interface IAboutState extends IPageState {

}