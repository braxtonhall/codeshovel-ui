import * as React from "react";
import {FormEvent, ReactNode} from "react";
import Form from "react-bootstrap/Form";
import {Constants} from "../Constants";
import Button from "react-bootstrap/Button";
import {ArgKind, Pages} from "../Enums";
import ErrorPane from "../ErrorPane";
import {IPageProps, IPageState, Page} from "./Page";

export class Landing extends Page<ILandingProps, ILandingState> {
	private readonly placeholder: string;
	private readonly errorText: string = Constants.INVALID_URL_ERROR_TEXT;

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

	public render(): ReactNode {
		if (this.state.onScreen || this.props.active) {
			setImmediate(this.setOnScreen);
			let transform: string;
			if (this.props.active) {
				transform = "translate(-50%, -50%)";
			} else if (this.props.forward) {
				transform = "translate(-200%, -50%)";
			} else {
				transform = "translate(200%, -50%)";
			}
			return (
				<div style={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform,
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
				</div>
			);
		} else {
			let transform: string;
			if (this.props.forward) {
				transform = "translate(-200%, -50%)";
			} else {
				transform = "translate(200%, -50%)";
			}
			return <div
				style={{
					position: "absolute",
					top: "50%",
					left: "50%",
					opacity: 0,
					transform,
				}}
			/>;
		}
	}
}

export interface ILandingProps extends IPageProps {
	proceedWithUpdate: (page: Pages, arg: any, kind: ArgKind) => void;
}

export interface ILandingState extends IPageState {
	error: boolean;
}
