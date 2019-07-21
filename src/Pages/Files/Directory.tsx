import {FadeableElement, IFadeableElementProps, IFadeableElementState} from "../../FadeableElement";
import {File, ReactFile} from "./File";
import * as React from "react";
import {ReactNode} from "react";
import {Constants} from "../../Constants";
import {Key} from "../../Enums";

export class Directory {
	private name: string;
	private subDirs: Directory[];
	private files: File[];
	private readonly alerter: (name: string) => void;
	private highlight: number | null;
	private expanded: boolean;
	private forceUpdate: () => void;

	constructor(name: string, contents: string[], alerter: (name: string) => void, parentUpdate: () => void, root: boolean = false) {
		this.name = name;
		this.alerter = alerter;
		this.subDirs = [];
		this.files = [];
		this.highlight = null;
		this.expanded = root;
		this.forceUpdate = parentUpdate;
		this.tellParent = this.tellParent.bind(this);
		this.moveHighlight = this.moveHighlight.bind(this);
		this.shouldHighlightThis = this.shouldHighlightThis.bind(this);
		this.setExpanded = this.setExpanded.bind(this);
		this.toggleExpanded = this.toggleExpanded.bind(this);
		this.isExpanded = this.isExpanded.bind(this);
		this.buildChildren(contents);
	}

	private buildChildren(contents: string[]): void {
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
		const keys = Object.keys(subDirs);
		if (keys.length === 1 && this.files.length === 0) {
			this.name = `${this.name}/${keys[0]}`;
			this.buildChildren(subDirs[keys[0]]);
		} else {
			this.subDirs = keys.map((key: string) => new Directory(key, subDirs[key], this.tellParent, this.forceUpdate));
		}
	}

	public setExpanded(expanded: boolean): void {
		this.expanded = expanded;
		this.forceUpdate();
	}

	public toggleExpanded(): void {
		this.expanded = !this.expanded;
		this.forceUpdate();
	}

	public isExpanded(): boolean {
		return this.expanded;
	}

	public moveHighlight(key: Key): void {
		if (this.highlight === null) {
			this.highlight = -1;
			return;
		}
		switch (key) {
			case Key.UP:
				if (this.shouldHighlightThis()) {
					// Give control up to the parent
				} else {
					// Give control to the selected child
				}
				break;
			case Key.DOWN:
				if (this.shouldHighlightThis()) {
					// If expanded, select child give control to it.
						// this should happen in other func --> If reached end of children, give control back up to parent
					// If not expanded, give control back up to the parent
				} else {
					// If expanded, give control to the selected child
				}
				break;
			case Key.RIGHT:
				break;
			case Key.LEFT:
				break;
		}
	}

	public shouldHighlightThis(): boolean {
		return this.highlight === -1;
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
		return <ReactDirectory dir={this} level={0} active={true} highlight={this.shouldHighlightThis()} expanded={this.isExpanded()}/>
	}
}

export class ReactDirectory extends FadeableElement<IReactDirectoryProps, IReactDirectoryState> {
	protected readonly fadeOutTime: number = 300;

	constructor(props: IReactDirectoryProps) {
		super(props);
		this.state = {onScreen: this.props.active, margin: 0};
		this.mouseDown = this.mouseDown.bind(this);
		this.toggleExpanded = this.toggleExpanded.bind(this);
		this.forceUpdate = this.forceUpdate.bind(this);
	}

	private toggleExpanded(): void {
		const state: IReactDirectoryState = Object.assign({}, this.state);
		// state.expanded = !state.expanded;
		state.margin = 0;
		// this.props.dir.setExpanded(state.expanded);
		this.props.dir.toggleExpanded();
		this.setState(state);
	}

	private mouseDown(): void {
		const state: IReactDirectoryState = Object.assign({}, this.state);
		state.margin = Constants.LIST_ELEMENT_NEW_LINE_PX_COUNT;
		this.setState(state);
	}

	protected createReactNode(): ReactNode {
		const style = {marginLeft: (this.props.level * Constants.LIST_ELEMENT_NEW_LINE_PX_COUNT) + this.state.margin + "px"};
		return(this.state.onScreen || this.props.active ?
			<div
				style={{display: "block"}}
			>
				<div
					style={{
						marginLeft: (this.props.level * Constants.LIST_ELEMENT_NEW_LINE_PX_COUNT) + this.state.margin + "px",
						animation: `${this.props.active ? "Expand" : "Contract"}  ${this.fadeOutTime}ms ease-in-out`,
						marginTop: "3px",
						marginBottom: "3px",
						backgroundColor: this.props.highlight ? "rgb(124, 0, 6)" : "rgb(75, 75, 124)",
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
					.map((dir: Directory, i: number) => <ReactDirectory dir={dir} level={this.props.level + 1} key={i} active={this.props.expanded && this.props.active} highlight={dir.shouldHighlightThis()} expanded={dir.isExpanded()}/>)}
				{this.props.dir.getFiles()
					.map((file: File, i: number) => <ReactFile file={file} level={this.props.level + 1} key={i} active={this.props.expanded && this.props.active}/>)}

			</div> :  <div style={style}/>
		);
	}
}

export interface IReactDirectoryProps extends IFadeableElementProps{
	dir: Directory;
	level: number;
	expanded: boolean;
	highlight: boolean;
}

export interface IReactDirectoryState extends IFadeableElementState {
	margin: number;
}