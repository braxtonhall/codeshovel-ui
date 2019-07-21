import * as React from "react";
import {FormEvent, ReactNode} from "react";
import {IPageProps, IPageState, Page} from "../Page";
import {ArgKind, Pages} from "../../Enums";
import {Constants} from "../../Constants";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {IMethodTransport} from "../../Types";
import {Method} from "./Method";

export class Methods extends Page<IMethodsProps, IMethodsState> {
	private readonly methodInputPlaceholder: string = Constants.METHODS_SEARCH_TEXT;
	protected readonly page: Pages = Pages.METHODS;
	private file: string;

	public constructor(props: IMethodsProps) {
		super(props);
		this.state = {
			onScreen: this.props.active,
			search: "",
		};
		this.file = "";
		this.proceedToNextPageAndUpdateSelected = this.proceedToNextPageAndUpdateSelected.bind(this);
		this.handleKey = this.handleKey.bind(this);
		this.handleEnter = this.handleEnter.bind(this);
	}

	private handleKey(): void {
		const searchElement: HTMLInputElement = (document.getElementById("searchInput") as HTMLInputElement);
		if (searchElement && typeof searchElement.value === "string" && searchElement.value !== this.state.search) {
			const state: IMethodsState = Object.assign({}, this.state);
			state.search = searchElement.value;
			this.setState(state);
		}
	}

	protected handleNext(): void {
		if (this.validSelection()) {
			this.props.proceedToPage(Pages.RESULTS);
		}
	}

	private validSelection(method?:IMethodTransport): boolean {
		method = method ? method : this.props.method;
		return method.longName !== "" && method.startLine >= 0;
	}

	private handleEnter(event: FormEvent): void {
		event.preventDefault();
		const searchMethods = this.props.content
			.filter((method: IMethodTransport) =>
				method.longName.includes(this.state.search)
			);
		if (searchMethods.length === 1 && this.validSelection(searchMethods[0])) {
			this.props.proceedWithUpdate(Pages.RESULTS, searchMethods[0], ArgKind.METHOD)
		}
	}

	private proceedToNextPageAndUpdateSelected(method: IMethodTransport): void {
		this.props.proceedWithUpdate(Pages.RESULTS, method, ArgKind.METHOD);
	}

	public createReactNode(): ReactNode {
		return (
			<div>
				<div>
					{this.state.onScreen || this.props.active ?
						<div
							style={{
								opacity: this.props.active ? 1 : 0,
								transition: this.fadeOutTime + "ms ease-in-out",
								position: "absolute",
								right: "-1%",
								top: "2%",
								font: "200% \"Courier New\", Futura, sans-serif",
								textAlign: "right",
								fontStyle: "italic",
							}}
						>
							Select a method.
						</div> : <div style={{right: "-1%", top: "2%", font: "200% \"Courier New\", Futura, sans-serif", opacity: 0}}/>
					}
				</div>
				<div>
					{this.state.onScreen || this.props.active ?
						<div style={{
							height: "100%",
							width: "100%",
							top: "50%",
							left: "50%",
							position: "absolute",
							transform: this.chooseTransform(),
							transition: this.fadeOutTime + "ms ease-in-out",
							opacity: 0.8,
						}}>
							<MethodContainer
								methods={this.props.content}
								search={this.state.search}
								tellParent={this.proceedToNextPageAndUpdateSelected}
							/>
						</div> : <div style={{top: "50%", left: "50%", transform: this.chooseTransform()}}/>
					}
				</div>
				<div>
					{this.state.onScreen || this.props.active ?
						<div style={{opacity: this.props.active ? 1 : 0, transition: this.fadeOutTime + "ms ease-in-out",}}>
							<div
								style={{
									width: "20%",
									position: "absolute",
									right: "2%",
									top: "10%",
								}}
							>
								<Form onSubmit={this.handleEnter}>
									<Form.Control id="searchInput" size="sm" type="text" placeholder={this.methodInputPlaceholder} onChange={this.handleKey}/>
								</Form>
							</div>
							<div
								style={{
									position: "absolute",
									top: "15%",
									right: "2%",
								}}
							>
								<Button variant="primary" onClick={this.handleNext} disabled={this.props.method.methodName === ""}>Next</Button>
							</div>
						</div> : <div style={{opacity: 0}}/>
					}
				</div>
			</div>
		);
	}

}

class MethodContainer extends React.Component<IMethodContainerProps, any> {
	public constructor(props: IMethodContainerProps) {
		super(props);
		this.tellParent = this.tellParent.bind(this);
	}

	private tellParent(method: IMethodTransport): void {
		this.props.tellParent(method);
	}

	public render(): ReactNode {
		return(
			<div
				className="Panel"
				style={{
					display: "block",
					textAlign: "left",
					height: "100%",
					width: "100%"
				}}
			>
				<div
					style={{
						position: "absolute",
						left: "5%",
					}}
				>
					{
						this.props.methods
							.map((method: IMethodTransport, i: number) => (
								<Method
									method={method}
									search={this.props.search}
									tellParent={this.tellParent}
									active={method.longName.includes(this.props.search)}
									index={i}
									key={i}
								/>
							))
					}
				</div>
			</div>
		);
	}
}

export interface IMethodsProps extends IPageProps {
	method: IMethodTransport;
	content: IMethodTransport[];
	proceedWithUpdate: (page: Pages, arg: any, kind: ArgKind) => void;
}

export interface IMethodsState extends IPageState {
	search: string;
}

export interface IMethodContainerProps {
	methods: IMethodTransport[];
	search: string;
	tellParent: (method: IMethodTransport) => void;
}
