import {FadeableElement, IFadeableElementProps, IFadeableElementState} from "../../FadeableElement";
import {File, ReactFile} from "./File";
import {ReactNode} from "react";
import {Constants} from "../../Constants";
import * as React from "react";

export class Directory {
	private readonly name: string;
	private readonly subDirs: Directory[];
	private readonly files: File[];
	private readonly alerter: (name: string) => void;

	constructor(name: string, contents: string[], alerter: (name: string) => void) {
		this.name = name;
		this.files = [];
		this.alerter = alerter;
		this.tellParent = this.tellParent.bind(this);
		const subDirs: {[name: string]: string[]} = {};
		for (const entry of contents) {
			const path = entry.split(/\/(.+)/);
			if (path.length === 1) {
				this.files.push(new File(entry, this.tellParent));
			} else {
				if (!subDirs[path[0]]) {
					subDirs[path[0]] = [];
				}
				subDirs[path[0]].push(path[1]);
			}
		}
		this.subDirs = Object.keys(subDirs).map((key: string) => new Directory(key, subDirs[key], this.tellParent));
	}

	private tellParent(path: string): void {
		this.alerter(this.name + "/" + path);
	}

	public getDirectories(): Directory[] {
		return this.subDirs;
	}

	public getFiles(): File[] {
		return this.files;
	}

	public getName(): string {
		return this.name;
	}

	public toReactNode(): ReactNode {
		return <ReactDirectory dir={this} level={0} active={true}/>
	}
}

export class ReactDirectory extends FadeableElement<IReactDirectoryProps, IReactDirectoryState> {
	protected readonly fadeOutTime: number = 300;

	constructor(props: IReactDirectoryProps) {
		super(props);
		if (this.props.level === 0) {
			this.state = {onScreen: this.props.active, expanded: true, margin: 0};
		} else {
			this.state = {onScreen: this.props.active, expanded: false, margin: 0};
		}
		// this.mouseUp = this.mouseUp.bind(this);
		this.mouseDown = this.mouseDown.bind(this);
		this.toggleExpanded = this.toggleExpanded.bind(this);
	}

	private toggleExpanded(): void {
		const state: IReactDirectoryState = Object.assign({}, this.state);
		state.expanded = !state.expanded;
		state.margin = 0;
		this.setState(state);
	}

	private mouseDown(): void {
		const state: IReactDirectoryState = Object.assign({}, this.state);
		state.margin = Constants.LIST_ELEMENT_NEW_LINE_PX_COUNT;
		this.setState(state);
	}

	public render(): ReactNode {
		if (this.state.onScreen || this.props.active) {
			setImmediate(this.setOnScreen);
			return(
				<div
					style={{display: "block"}}
				>
					<div
						style={{
							marginLeft: (this.props.level * Constants.LIST_ELEMENT_NEW_LINE_PX_COUNT) + this.state.margin + "px",
							animation: `${this.props.active ? "Expand" : "Contract"}  ${this.fadeOutTime}ms ease-in-out`,
							marginTop: "3px",
							marginBottom: "3px",
							backgroundColor: "rgb(75, 75, 124)",
							height: this.props.active ? "40px" : "0",
							font: "100% \"Courier New\", Futura, sans-serif",
							width: "650px",
							overflow: "hidden",
							zIndex: 9999,
							transition: this.fadeOutTime + "ms ease-in-out",
						}}
						onClick={this.toggleExpanded}
						onMouseDown={this.mouseDown}
					>
						{this.props.dir.getName() + "/"}
					</div>
					{this.props.dir.getDirectories()
						.map((dir: Directory, i: number) => <ReactDirectory dir={dir} level={this.props.level + 1} key={i} active={this.state.expanded && this.props.active}/>)}
					{this.props.dir.getFiles()
						.map((file: File, i: number) => <ReactFile file={file} level={this.props.level + 1} key={i} active={this.state.expanded && this.props.active}/>)}

				</div>
			);
		} else {
			const style = {marginLeft: (this.props.level * Constants.LIST_ELEMENT_NEW_LINE_PX_COUNT) + this.state.margin + "px"};
			return <div style={style}/>;
		}
	}
}

export interface IReactDirectoryProps extends IFadeableElementProps{
	dir: Directory;
	level: number;
}

export interface IReactDirectoryState extends IFadeableElementState {
	expanded: boolean;
	margin: number;
}