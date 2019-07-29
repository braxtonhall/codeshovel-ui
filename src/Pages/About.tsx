import {IPageProps, IPageState, Page} from "./Page";
import {Pages} from "../Enums";
import {ReactNode} from "react";
import * as React from "react";
import {Constants} from "../Constants";

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

	private getFontSize(s: string, modifier: number = 1): string {
		return (this.props.windowWidth * (1 / Math.max(s.length, 50)) * 0.01 * Constants.ABOUT_TEXT_SIZE * modifier) + "px";
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
				font: Constants.FONT,
			}}>
				<div style={{
					position: "absolute",
					backgroundImage: "url(/icon.png)",
					width: this.getFontSize("", 16.5),
					height: this.getFontSize("", 16.5),
					backgroundSize: "contain",
					backgroundRepeat: "no-repeat",
					opacity: 0.5,
					top: "-20%",
					left: "5%",
				}}/>
				<div
					style={{
						fontSize: this.getFontSize("codeshovel", 3),
						top: "5%",
						left: "5%",
						position: "absolute",
						textAlign: "center",
						whiteSpace: "nowrap"
					}}
				>
					<code>codeshovel</code>
					<br/>
					<div style={{fontSize: this.getFontSize("Unearthing Method Histories")}}>Unearthing Method Histories</div>
				</div>
				<div
					style={{
						width: "30%",
						height: "60%",
						right: "10%",
						top: "15%",
						position: "absolute",
					}}
				>
					<Contributor
						image={"url(https://avatars2.githubusercontent.com/u/1646086?s=400&v=4)"}
						name={"Felix Grund"}
						github={"ataraxie"}
						info={"Felix is codeshovel's dad."}

					/>
					<Contributor
						image={"url(https://avatars2.githubusercontent.com/u/2560480?s=400&v=4)"}
						name={"Nick Bradley"}
						github={"nickbradley"}
						info={"Nick is a codeshovel's stepmom?"}

					/>
					<Contributor
						image={"url(https://avatars3.githubusercontent.com/u/35436247?s=400&v=4)"}
						name={"Braxton Hall"}
						github={"braxtonhall"}
						info={"Braxton dressed codeshovel for its interview"}

					/>
					<div
						style={{
							backgroundImage: "url(https://news.ok.ubc.ca/wp-content/uploads/2015/09/ubc-logo.png)",
							backgroundSize: "100%",
							backgroundRepeat: "no-repeat",
							height: "100%",
							width: "30%",
							position: "absolute"
						}}
					/>
					<div
						className="SubtleButton"
						style={{
							backgroundImage: "url(https://spl.cs.ubc.ca/img/logo_spl.png)",
							backgroundSize: "100%",
							backgroundRepeat: "no-repeat",
							height: "15%",
							width: "17%",
							left: "33%",
							position: "absolute",
						}}
						onClick={() => {
							window.open(`https://spl.cs.ubc.ca/`, "_blank");
						}}
					/>
				</div>
			</div>
		);
	}
}

class Contributor extends React.Component<IContributorProps, any> {
	constructor(props: IContributorProps) {
		super(props);
		this.state = {

		};
	}

	public render(): ReactNode {
		return (
			<div
				style={{
					// backgroundColor: "red",
					width: "100%",
					height: "30%",
					position: "relative",
					display: "inline-block"
				}}
			>
				<div style={{
					backgroundImage: this.props.image,
					width: "66%",
					height: "100%",
					backgroundSize: "contain",
					backgroundRepeat: "no-repeat",
				}}/>
				<div
					style={{
						height: "100%",
						position: "absolute",
						top: "5%",
						left: "40%",
						textAlign: "left"
					}}
				>
					<div>
						{this.props.name}
					</div>
					<div
						className="SubtleButton"
						style={{fontSize: "50%"}}
						onClick={() => {
							window.open(`https://github.com/${this.props.github}`, "_blank");
						}}
					>
						{this.props.github}
					</div>
					<div
						style={{fontSize: "70%", marginTop: "5%"}}
					>
						{this.props.info}
					</div>
				</div>
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

interface IContributorProps {
	image: string;
	name: string;
	github: string; // ataraxie, nickbradley
	info: string;
}
