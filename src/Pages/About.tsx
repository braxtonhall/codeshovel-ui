import {IPageProps, IPageState, Page} from "./Page";
import {Pages} from "../Enums";
import {ReactNode} from "react";
import * as React from "react";
import {Constants} from "../Constants";

export class About extends Page<IAboutProps, IAboutState> {
	protected readonly page = Pages.ABOUT;
	private readonly codeshovelRepo: string = `https://github.com/ataraxie/codeshovel`;
	private readonly codeshovelUiRepo: string = `https://github.com/braxtonhall/codeshovel-ui`;
	private readonly codeshovelWebserviceRepo: string = `https://github.com/braxtonhall/codeshovel-webservice`;
	private readonly codeshovelPaperRepo: string = `https://open.library.ubc.ca/cIRcle/collections/ubctheses/24/items/1.0379647`;
	private readonly splLink: string = `https://spl.cs.ubc.ca/`;
	private readonly ubcLink: string = `https://www.ubc.ca`;

	constructor(props: IAboutProps) {
		super(props);
		this.state = {
			onScreen: this.props.active,
			tutorialDismissed: true
		}
	}

	protected handleNext(): void {

	}

	private getFontSize(s: string, modifier: number = 1): number {
		const mobileView: boolean = this.props.windowWidth < Constants.MOBILE_WIDTH;
		return ((mobileView ? 2.4 : 1) * this.props.windowWidth * (1 / Math.max(s.length, 50)) * 0.01 * Constants.ABOUT_TEXT_SIZE * modifier);
	}

	private getBoxFontSize(modifier: number): string {
		const mobileView: boolean = this.props.windowWidth < Constants.MOBILE_WIDTH;
		return Math.sqrt((mobileView ? 2 : 1) * this.props.windowHeight * this.props.windowWidth * 0.01 * (1/50) * Constants.ABOUT_TEXT_SIZE * modifier) + "px";
	}

	protected createReactNode(): ReactNode {
		const mobileView: boolean = this.props.windowWidth < Constants.MOBILE_WIDTH;
		const contributorWidth: number = 0.35 * this.props.windowWidth * (mobileView ? 2 : 1);
		const contributorHeight: number = 0.70 * 0.25 * this.props.windowHeight;
		return (
			<div>
				<div
					style={{
						position: "absolute",
						top: "50%",
						left: "50%",
						width: "100%",
						height: "100%",
						transform: this.chooseTransform(),
						opacity: this.props.active ? 1 : 0,
						transition: `${this.fadeOutTime}ms ease-in-out`,
					}}
				>
					<div style={{
						position: "absolute",
						backgroundImage: `url(${process.env.PUBLIC_URL}/icon.png)`,
						width: this.getFontSize("", 16.5),
						height: this.getFontSize("", 16.5),
						backgroundSize: "contain",
						backgroundRepeat: "no-repeat",
						opacity: 0.1,
						top: "-20%",
						left: "10%",
					}}/>
				</div>
				<div
					className="Panel"
					style={{
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
					}}
				>
					<div
						style={{
							fontSize: this.getFontSize("CodeShovel::Python3", 1.6),
							top: "5%",
							right: "10%",
							position: "absolute",
							textAlign: "center",
						}}
					>
						<code>CodeShovel::Python3</code>
						<br/>
						<div style={{fontSize: this.getFontSize("Unearthing Method Histories")}}>Unearthing Method Histories</div>
						<div
							style={{fontSize: this.getBoxFontSize(0.04), textAlign: "left", position: "absolute", marginTop: "8%", width: this.getFontSize("", 16.5)}}
						>
							<div style={{marginBottom: "1.5%", fontSize: "75%"}}>
								CodeShovel::Python3 is a Python syntax aware analysis tool that can track changes to a function that are not easily discovered with traditional version control tools.
							</div>
							<div style={{marginBottom: "6%", fontSize: "45%"}}>
								Originally implemented for Java, it was extended to Python for CPSC 311.
							</div>
							<div style={{marginBottom: "1.5%", fontSize: "45%"}}>
								Consider the following case,
							</div>
							<div style={{marginBottom: "2%", fontSize: "55%"}}>
								A Python 3 developer prepares to merge a Pull Request from another developer on her team into the develop branch of their project.
							</div>
							<div style={{marginBottom: "2%", fontSize: "55%"}}>
								In the Pull Request she sees a method she is unfamiliar with.
							</div>
							<div style={{marginBottom: "2%", fontSize: "55%"}}>
								She performs a git log, walking through the file’s history one commit at a time to better understand how and why the method came to be. However the method abruptly shows up as additions in its entirety only a few commits before the HEAD of the branch.
							</div>
							<div style={{marginBottom: "2%", fontSize: "55%"}}>
								Unbeknownst to the developer, the method had been moved up from a child class from that commit. The tools supposedly designed to archive code mutation have failed her; the method’s true birth and early germination period in the child class are lost to the developer.
							</div>
							<div style={{marginBottom: "7%", fontSize: "55%"}}>
								However they would have been found by CodeShovel.
							</div>
							<div style={{marginBottom: "4%", fontSize: "65%"}}>
								By building and interpreting Abstract Syntax Trees for every commit, CodeShovel::Python3 can do better than trace dates and line changes; it can track changes to specific a Python function as is moves around a file, as common refactorings are applied to it, and even as it is moved across files in a code base.
							</div>
							<div style={{marginBottom: "5%", fontSize: "60%"}}>
								CodeShovel walks backward through the commit history like a linked list, uses a Similarity Algorithm to rank and isolate the "same" function, and returns to you only the changes that affected it.
							</div>
							{/*{!mobileView ?*/}
								<div style={{marginBottom: "5%", fontSize: "60%"}}>
									Click that little arrow on the right to try it out yourself.
								</div> {/*:*/}
							{/*	""*/}
							{/*}*/}
							<div style={{marginBottom: "0.5%", fontSize: "55%"}}>
								If you would like to do more reading, here are our reports!
							</div>
							<div
								style={{
									backgroundColor: "rgb(183, 166, 108)",
									height: this.getFontSize("", 3),
									width: this.getFontSize("", 16.5),
									position: "absolute",
								}}
							>
								<div
									style={{
										display: "grid",
										gridTemplateColumns: "1fr 1fr",
										width: "100%",
										height: "100%",
										zIndex: 1000,
										color: "rgb(0,0,0)",
										fontSize: this.getFontSize("webservice"),
										marginBottom: "10%"
									}}
								>
									<a
										className="SubtleButton CommitRowCell"
										href={process.env.PUBLIC_URL +"/docs/proposal.pdf"}
										style={{color: "black", backgroundColor: "rgba(255, 255, 255, 0.3)"}}
										onClick={(ev) => {
											ev.preventDefault();
											window.open(process.env.PUBLIC_URL +"/docs/proposal.pdf", "_blank");
										}}

									>
										proposal
									</a>
									<a
										className="SubtleButton CommitRowCell"
										href={process.env.PUBLIC_URL +"/docs/background.pdf"}
										style={{color: "black", backgroundColor: "rgba(255, 255, 255, 0.1)"}}
										onClick={(ev) => {
											ev.preventDefault();
											window.open(process.env.PUBLIC_URL +"/docs/background.pdf", "_blank");
										}}
									>
										background
									</a>
									<a
										className="SubtleButton CommitRowCell"
										href={process.env.PUBLIC_URL +"/docs/plan.pdf"}
										// style={{color: "black", backgroundColor: "rgba(255, 255, 255, 0.2)"}}
										style={{color: "black", backgroundColor: "#a8a8a8", pointerEvents: "none"}} // Disabled view TODO
										onClick={(ev) => {
											ev.preventDefault();
											window.open(process.env.PUBLIC_URL +"/docs/plan.pdf", "_blank");
										}}
									>
										plan
									</a>
									<a
										className="SubtleButton CommitRowCell Disabled"
										href={process.env.PUBLIC_URL +"/docs/final.pdf"}
										// style={{color: "black", backgroundColor: "rgba(255, 255, 255, 0.15)"}}
										style={{color: "black", backgroundColor: "#a8a8a8", pointerEvents: "none"}} // Disabled view TODO
										onClick={(ev) => {
											ev.preventDefault();
											window.open(process.env.PUBLIC_URL +"/docs/final.pdf", "_blank");
										}}
									>
										final
									</a>
								</div>
							</div>
						</div>
					</div>
					<div
						style={{
							width: contributorWidth,
							left: "10%",
							top: mobileView ? "70%" : "10%",
							position: "absolute",
						}}
					>
						<Contributor
							containerWidth={contributorWidth}
							containerHeight={contributorHeight}
							image={"url(https://avatars3.githubusercontent.com/u/35436247?s=400&v=4)"}
							name={"Braxton Hall"}
							username={"braxtonhall"}
							info={"Braxton is a BA student, and plays Marth in Super Smash Bros. Melee."}

						/>
						<Contributor
							containerWidth={contributorWidth}
							containerHeight={contributorHeight}
							image={"url(https://avatars2.githubusercontent.com/u/57985355?s=400&v=4)"}
							name={"Danhui Jia"}
							username={"danhuijia"}
							info={"Danhui is a BUCS student, and likes to scream with guinea pigs."}

						/>
						<Contributor
							containerWidth={contributorWidth}
							containerHeight={contributorHeight}
							image={"url(https://avatars1.githubusercontent.com/u/33373979?s=400&v=4)"}
							name={"Lilli Freischem"}
							username={"lillif"}
							info={"Lilli is a visiting student from the University of Edinburgh, and ..."}
						/>
						<Contributor
							containerWidth={contributorWidth}
							containerHeight={contributorHeight}
							image={"url(https://avatars2.githubusercontent.com/u/43458455?s=400&v=4)"}
							name={"Brian Yeung"}
							username={"byeung18"}
							info={"Brian is a BCS student, and likes blueberries and bubble tea."}

						/>
						<div style={{
							marginTop: "1%",
							position: "relative",
							height: (mobileView ? 3 : 1) * this.props.windowWidth * 0.06 + "px",
							width: (mobileView ? 3 : 1) * this.props.windowWidth * 0.12 + "px",
						}}>
							<a href={this.ubcLink}>
								<div
									className="SubtleButton"
									style={{
										backgroundImage: `url(${process.env.PUBLIC_URL}/ubc-invert.png)`,
										backgroundSize: "100%",
										backgroundRepeat: "no-repeat",
										whiteSpace: "nowrap",
										height: "100%",
										width: "50%",
										float: "left",
									}}
									onClick={(ev) => {
										ev.preventDefault();
										window.open(this.ubcLink, "_blank");
									}}
								/>
							</a>
							<a href={this.splLink}>
								<div
									className="SubtleButton"
									style={{
										backgroundImage: `url(${process.env.PUBLIC_URL}/spl-invert.png)`,
										backgroundSize: "100%",
										backgroundRepeat: "no-repeat",
										height: "100%",
										width: "50%",
										marginLeft: "50%"
									}}
									onClick={(ev) => {
										ev.preventDefault();
										window.open(this.splLink, "_blank");
									}}
								/>
								</a>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

class Contributor extends React.Component<IContributorProps, any> {
	private readonly link: string;
	private readonly linkDesc: string;

	constructor(props: IContributorProps) {
		super(props);
		this.state = {

		};
		if (this.props.link && this.props.linkDesc) {
			this.link = this.props.link;
			this.linkDesc = this.props.linkDesc;
		} else {
			this.link = `https://github.com/${this.props.username}`;
			this.linkDesc = `github/${this.props.username}`
		}
	}

	public render(): ReactNode {
		const notStacked: boolean = (this.props.containerWidth / 3.5) < this.props.containerHeight;
		return (
			<div
				style={{
					width: this.props.containerWidth,
					height: this.props.containerHeight,
					position: "relative",
					display: notStacked ? "inline-block" : "",
					marginBottom: notStacked ? "30%" : "1%",
				}}
			>
				<div style={{
					backgroundImage: this.props.image,
					width: this.props.containerHeight,
					height: this.props.containerHeight,
					backgroundSize: "contain",
					backgroundRepeat: "no-repeat",
				}}/>
				<div
					style={{
						height: "100%",
						position: notStacked ? "initial" : "absolute",
						top: "5%",
						marginLeft: notStacked ? "5%" : "30%",
						textAlign: "left",
					}}
				>
					<div>
						{this.props.name}
					</div>
					<a href={this.link}>
						<div
							className="SubtleButton Underline"
							style={{color: "white", fontSize: "50%"}}
							onClick={(ev) => {
								ev.preventDefault();
								window.open(this.link, "_blank");
							}}
						>
							{this.linkDesc}
						</div>
					</a>
					<div
						style={{fontSize: "60%", marginTop: "3%"}}
					>
						{this.props.info}
					</div>
				</div>
			</div>
		);
	}
}

export interface IAboutProps extends IPageProps {
	windowHeight: number;
}

export interface IAboutState extends IPageState {

}

interface IContributorProps {
	containerWidth: number;
	containerHeight: number;
	image: string;
	name: string;
	username: string;
	info: string;
	link?: string;
	linkDesc?: string;
}
