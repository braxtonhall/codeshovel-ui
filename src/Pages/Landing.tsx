import * as React from "react";
import {FormEvent, ReactNode} from "react";
import Form from "react-bootstrap/Form";
import {Constants} from "../Constants";
import Button from "react-bootstrap/Button";
import {ArgKind, Pages} from "../Enums";
import ErrorPane from "../Panes/ErrorPane";
import {IPageProps, IPageState, Page} from "./Page";

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

	// protected updateContent(): void {
	//
	// }

	public createReactNode(): ReactNode {
		return (
			this.state.onScreen || this.props.active ?
			<div style={{
				position: "absolute",
				top: "50%",
				left: "50%",
				transform: this.chooseTransform(),
				opacity: this.props.active ? 1 : 0,
				transition: `${this.fadeOutTime}ms ease-in-out`,
				textAlign: "center",
			}}>
				<p>
					Welcome to Felix's Java <code>codeshovel</code>.
				</p>
				<p>
					To begin, enter a link to a Java GitHub repository.
				</p>
				<Form onSubmit={this.handleEnter}>
					<Form.Control id="repoInput" size="lg" type="text" placeholder={this.placeholder}/>
				</Form>
				<Button variant="primary" onClick={this.handleNext} disabled={this.state.error}>Next</Button>
				<ErrorPane text={this.errorText} active={this.state.error} exit={this.toggleError} size={{height: 50, width: 120}}/>
			</div> :
			<div
				style={{
					position: "absolute",
					top: "50%",
					left: "50%",
					opacity: 0,
					transform: this.chooseTransform(),
				}}
			/>
		);
	}
}

export interface ILandingProps extends IPageProps {
	proceedWithUpdate: (page: Pages, arg: any, kind: ArgKind) => void;
}

export interface ILandingState extends IPageState {
	error: boolean;
}
