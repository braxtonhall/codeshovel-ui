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
					left: "10%",
				}}/>
				<div
					style={{
						fontSize: this.getFontSize("codeshovel", 3),
						top: "5%",
						left: "10%",
						position: "absolute",
						textAlign: "center",
						whiteSpace: "nowrap"
					}}
				>
					<code>codeshovel</code>
					<br/>
					<div style={{fontSize: this.getFontSize("Unearthing Method Histories")}}>Unearthing Method Histories</div>
				</div>
				<div // TODO child this to same container as the picture and give it a small margin
					style={{textAlign: "left", position: "absolute", top: "40%", width: this.getFontSize("", 16.5), left: "10%"}}
				>
					<div style={{marginBottom: "5%", fontSize: "70%"}}>
						Take this shovel and dig through source code history for changes to specific methods.
						Currently implemented for Java with more languages to follow.
					</div>
					<div style={{marginBottom: "5%", fontSize: "60%"}}>
						<code>codeshovel</code> is a tool for navigating dedicated method histories, across all kinds of changes that the method saw throughout its life span.
						It is capable of tracking a method not only as it moves between line ranges, but as it moves through classes and around a codebase, from file to file, across traditionally disparate histories.
					</div>
					<div style={{marginBottom: "5%", fontSize: "60%"}}>
						Enter a repository link, open a file, and select a method to try it for yourself.
					</div>
				</div>
				<div
					style={{
						width: "35%",
						height: "70%",
						right: "10%",
						top: "10%",
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
						name={"Nick C. Bradley"}
						github={"nickbradley"}
						info={"Nick is codeshovel's stepmom?"}

					/>
					<Contributor
						image={"url(https://avatars1.githubusercontent.com/u/89003?s=400&v=4)"}
						name={"Reid Holmes"}
						github={"rtholmes"}
						info={"Reid was the midwife at codeshovel's birth."}

					/>
					<Contributor
						image={"url(https://avatars3.githubusercontent.com/u/35436247?s=400&v=4)"}
						name={"Braxton Hall"}
						github={"braxtonhall"}
						info={"Braxton dressed codeshovel for its interview."}

					/>
					<div
						style={{
							backgroundImage: "url(https://news.ok.ubc.ca/wp-content/uploads/2015/09/ubc-logo.png)",
							backgroundSize: "100%",
							backgroundRepeat: "no-repeat",
							height: "20%",
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
				<div
					style={{
						backgroundColor: "rgb(183, 166, 108)",
						height: "10%",
						width: this.getFontSize("", 16.5),
						left: "10%",
						bottom: "10%",
						// transform: "translate(-50%, 0)",
						position: "absolute",
						overflow: "hidden"
					}}
				>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							width: "100%",
							height: "100%",
							zIndex: 1000,
							color: "rgb(0,0,0)"
						}}
					>
						<div
							className="SubtleButton CommitRowCell"
							style={{backgroundColor: "rgba(255, 255, 255, 0.3)"}}
							onClick={() => {
								window.open(`https://github.com/ataraxie/codeshovel`, "_blank");
							}}

						>
							codeshovel
						</div>
						<div
							className="SubtleButton CommitRowCell"
							style={{backgroundColor: "rgba(255, 255, 255, 0.1)"}}
							onClick={() => {
								window.open(`https://github.com/braxtonhall/codeshovel-webservice`, "_blank");
							}}
						>
							webservice
						</div>
						<div
							className="SubtleButton CommitRowCell"
							style={{backgroundColor: "rgba(255, 255, 255, 0.2)"}}
							onClick={() => {
								window.open(`https://github.com/braxtonhall/codeshovel-ui`, "_blank");
							}}
						>
							ui
						</div>
						<div
							className="SubtleButton CommitRowCell"
							style={{backgroundColor: "rgba(255, 255, 255, 0.15)"}}
							onClick={() => {
								window.open(`https://github.com/ataraxie/codeshovel-paper`, "_blank");
							}}
						>
							paper
						</div>
					</div>
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
					height: "25%",
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
						left: "35%",
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
	github: string;
	info: string;
}
