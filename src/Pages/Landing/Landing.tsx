import * as React from "react";
import {FormEvent, ReactNode} from "react";
import Form from "react-bootstrap/Form";
import {Constants} from "../../Constants";
import Button from "react-bootstrap/Button";
import {ArgKind, Pages} from "../../Enums";
import ErrorPane from "../../Panes/ErrorPane";
import {IPageProps, IPageState, Page} from "../Page";
import {IManifestEntry} from "../../Types";
import {Example} from "./Example";
import {FadeableElement, IFadeableElementProps, IFadeableElementState} from "../../FadeableElement";
import SmallButton from "../../Buttons/SmallButton";

export class Landing extends Page<ILandingProps, ILandingState> {
	private readonly placeholder: string;
	private readonly errorText: string = Constants.INVALID_URL_ERROR_TEXT;
	protected readonly page: Pages = Pages.LANDING;

	public constructor(props: ILandingProps) {
		super(props);
		this.state = {
			error: false,
			onScreen: this.props.active,
		};
		this.placeholder = Constants.EXAMPLE_LINKS[Math.floor(Math.random() * Constants.EXAMPLE_LINKS.length)];
		this.toggleError = this.toggleError.bind(this);
		this.handleEnter = this.handleEnter.bind(this);
	}

	protected handleNext(): void {
		const repoElement: HTMLInputElement = (document.getElementById("repoInput") as HTMLInputElement);
		let repoLink: string = "";
		if (repoElement && repoElement.value) {
			repoLink = repoElement.value;
		}
		if (!repoLink.endsWith(".git")) {
			repoLink = repoLink + ".git";
		}
		if (repoLink !== ".git") {
			this.props.proceedWithUpdate(Pages.FILES, repoLink, ArgKind.REPO)
		} else {
			this.toggleError();
		}
	}

	private toggleError() {
		const state: ILandingState = Object.assign({}, this.state);
		state.error = !this.state.error;
		this.setState(state);
	}

	private handleEnter(event: FormEvent): void {
		event.preventDefault();
		this.handleNext();
	}

	public createReactNode(): ReactNode {
		const mobileView: boolean = this.props.windowWidth < Constants.MOBILE_WIDTH;
		const examplesShown: boolean = (this.props.examples.length > 0 && !this.props.examplesHidden) || mobileView;
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
				alignItems: "center"
			}}>
				<div
					style={{
						position: "absolute",
						width: "5%",
						height: "75%",
						zIndex: 0
					}}
					onMouseEnter={() => {
						if (this.props.examplesHidden) {
							this.props.toggleHidden();
						}
					}}
				/>
				<ExampleContainer
					active={examplesShown}
					tellParentExampleClicked={this.props.tellParent}
					examples={this.props.examples}
					examplesHidden={this.props.examplesHidden}
					toggleExamplesHidden={this.props.toggleHidden}
					windowWidth={this.props.windowWidth}
				/>
				{!mobileView ?
					<div
						className="NoClick"
						style={{
							position: "absolute",
							top: "50%",
							left: "50%",
							width: "40%",
							transform: examplesShown ? "translate(-20%, -50%)" : "translate(-50%, -50%)",
							height: "20%",
							zIndex: 5000,
							transition: `${400 /*This should be the same as ExampleContainer fadeOutTime*/}ms ease-in-out`,
						}}
					>
						<p>
							Welcome to Felix's Java <code>codeshovel</code>.
						</p>
						<p>
							To begin, enter a link to a Java GitHub repository.
						</p>
						<Form style={{pointerEvents: "auto"}} onSubmit={this.handleEnter}>
							<Form.Control id="repoInput" size="lg" type="text" placeholder={this.placeholder}/>
						</Form>
						<Button style={{pointerEvents: "auto"}} variant="primary" onClick={this.handleNext}
								disabled={this.state.error}>Next</Button>
					</div> : <div/>
				}
				<ErrorPane text={this.errorText} active={this.state.error} exit={this.toggleError} size={{height: 30, width: 72}}/>
			</div>
		);
	}
}

class ExampleContainer extends FadeableElement<IExampleContainerProps, IExampleContainerState> {
	protected fadeOutTime: number = 400;

	public constructor(props: IExampleContainerProps) {
		super(props);
		this.state = {
			onScreen: this.props.active,
		};
		this.tellParentExampleClicked = this.tellParentExampleClicked.bind(this);
	}

	private tellParentExampleClicked(example: IManifestEntry): void {
		this.props.tellParentExampleClicked(example);
	}

	protected createReactNode(): ReactNode {
		return(this.props.active || this.state.onScreen ?
			<div
				className="Panel"
				style={{
					display: "block",
					font: Constants.FONT,
					textAlign: "left",
					height: "100%",
					width: "100%",
					left: this.props.active ? "0" : "-50%",
					opacity: this.props.active ? 1 : 0,
					transition: `${this.fadeOutTime}ms ease-in-out`,
					zIndex: 2,
				}}
			>
				<div
					style={{display: "inline-block", opacity: 0.5, position: "relative"}}
				>
					<div
						style={{
							textAlign: "left",
							left: "20%",
							top: "10%",
							fontSize: "20px",
							marginTop: "6px",
							marginLeft: "6px",
						}}
					>
						Sample <code>codeshovel</code> Executions
					</div>
					<SmallButton
						height={15}
						width={15}
						left={350}
						backgroundSize={10}
						backgroundImage={"url(/cross.png)"}
						onClick={() => {
							if (!this.props.examplesHidden) {
								this.props.toggleExamplesHidden()
							}
						}}
						bottom={4}
						shift={0}
						active={true}
					/>
				</div>
				<div
					style={{
						position: "absolute",
						zIndex: 0,
						marginBottom: "1em"
					}}
				>
					<Example
						windowWidth={this.props.windowWidth}
						example={false}
						tellParent={() => {}}
					/>
					{
						this.props.examples
							.map((example: IManifestEntry, i: number) => (
								<Example
									windowWidth={this.props.windowWidth}
									example={example}
									tellParent={this.tellParentExampleClicked}
									key={i}
								/>
							))
					}
				</div>
			</div> : <div style={{opacity: 0, left: "-50%"}}/>
		);
	}
}

export interface ILandingProps extends IPageProps {
	proceedWithUpdate: (page: Pages, arg: any, kind: ArgKind) => Promise<void>;
	examples: IManifestEntry[];
	examplesHidden: boolean;
	tellParent: (example: IManifestEntry) => void;
	toggleHidden: () => void;
	windowWidth: number;
}

export interface ILandingState extends IPageState {
	error: boolean;
}

interface IExampleContainerProps extends IFadeableElementProps {
	tellParentExampleClicked: (example: IManifestEntry) => void;
	examples: IManifestEntry[];
	examplesHidden: boolean;
	toggleExamplesHidden: () => void;
	windowWidth: number;
}

interface IExampleContainerState extends IFadeableElementState {

}
