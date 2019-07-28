import {IManifestEntry} from "../../Types";
import {Constants} from "../../Constants";
import {ReactNode} from "react";
import * as React from "react";
import {Changes} from "../../Enums";

export class Example extends React.Component<IReactExampleProps, IReactExampleState> {

	constructor(props: IReactExampleProps) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
		this.mouseDown = this.mouseDown.bind(this);
		this.tellParent = this.tellParent.bind(this);
	}

	private static getWidth(s: string): string {
		return (10 * Math.log(Math.max(10, s.length)) * Constants.EXAMPLE_ROW_WIDTH) + "px";
	}

	private static getFontSize(s: string, modifier: number = 1): string {
		return (10 / (Math.log(Math.max(s.length, 10))) * Constants.EXAMPLE_TEXT_SIZE * modifier) + "px";
	}

	private handleClick(): void {
		this.props.tellParent(this.props.example);
	}

	private mouseDown(): void {

	}

	private tellParent(): void {

	}

	public render(): ReactNode {
		const display: string = `${this.props.example.repoShort}->${this.props.example.methodName}`;
		return(
				<div
					style={{display: "block"}}
				>
					<div
						className="InvertedSubtleButton ExampleRow"
						style={{
							position: "relative",
							marginTop: "3px",
							marginBottom: "3px",
							height: "40px",
							width: Example.getWidth(display),
							overflow: "hidden",
							zIndex: 9999,
							fontSize: Example.getFontSize(display),
						}}
						onClick={this.handleClick}
						onMouseDown={this.mouseDown}
					>
						{display}
						<div style={{
							height: "5px",
							width: "100%",
							position: "absolute",
							bottom: "0",
							display: "grid",
							gridTemplateColumns: new Array(this.props.example.historyShort.length).fill("1fr").join(" "),
						}}>
							{
								this.props.example.historyShort.map((change: Changes, i: number) => <div key={i} className={change}/>)
							}
						</div>
					</div>
				</div>
		);
	}
}

export interface IReactExampleProps {
	example: IManifestEntry;
	tellParent: (example: IManifestEntry) => void;
}

export interface IReactExampleState {

}