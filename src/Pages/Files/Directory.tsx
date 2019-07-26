import {IFadeableElementProps, IFadeableElementState} from "../../FadeableElement";
import {File, ReactFile} from "./File";
import * as React from "react";
import {ReactNode} from "react";
import {Constants} from "../../Constants";
import {Key} from "../../Enums";
import {ReactFileSystemNode} from "./FileSystemNode";

export class Directory {
	private name: string;
	private subDirs: Directory[];
	private files: File[];
	private readonly alerter: (name: string) => void;
	private highlight: number | null;
	private expanded: boolean;
	private forceUpdate: () => void;
	private parent: Directory | null;

	constructor(name: string, contents: string[], alerter: (name: string) => void, parentUpdate: () => void, root: boolean, parent: Directory | null = null) {
		this.name = name;
		this.alerter = alerter;
		this.subDirs = [];
		this.files = [];
		this.highlight = null;
		this.expanded = root;
		this.forceUpdate = parentUpdate;
		this.parent = parent;
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
			this.subDirs = keys.map((key: string) => new Directory(key, subDirs[key], this.tellParent, this.forceUpdate, false, this));
		}
	}

	public setExpanded(expanded: boolean): void {
		this.expanded = expanded;
		this.highlight = !this.expanded && this.highlight ? -1 : this.highlight;
		this.subDirs.forEach((subDir) => subDir.removeHighlight());
	}

	public toggleExpanded(): void {
		this.setExpanded(!this.expanded);
		this.forceUpdate();
	}

	public isExpanded(): boolean {
		return this.expanded;
	}

	public removeHighlight(): void {
		this.highlight = null;
	}

	public moveHighlightAmongChildren(key: Key): void {
		if (this.shouldHighlightThis()) {
			this.moveHighlightHelper(key);
		} else if (this.highlight !== null && this.highlight < this.subDirs.length) {
			this.subDirs[this.highlight].moveHighlight(key);
		} else if (this.highlight && this.highlight - this.subDirs.length < this.files.length) {
			// if (key === Key.UP) {
			// 	if (this.highlight !== null && this.highlight < this.subDirs.length) {
			// 		this.subDirs[this.highlight].moveHighlight(key);
			// 	} else {
			// 		this.files[this.highlight - this.subDirs.length].addHighlight();
			// 	}
			// } else if (key === Key.DOWN) {
			// 	if (this.highlight - this.subDirs.length < this.files.length) {
			// 		this.files[this.highlight - this.subDirs.length].addHighlight();
			// 	} else {
			// 		if (this.parent) {
			// 			this.parent.moveHighlightHelper(key);
			// 		}
			// 	}
			// } else if (key === Key.LEFT) {
			// 	if (this.parent) {
			// 		this.parent.moveHighlightHelper(key);
			// 	}
			// }
		}
	}

	public moveHighlightHelper(key: Key): void {
		// if (this.highlight !== null && (key === Key.UP || key === Key.DOWN)) {
		// 	if (this.files[this.highlight - this.subDirs.length] !== undefined) {
		// 		this.files[this.highlight].removeHighlight();
		// 		this.highlight = key === Key.UP ? this.highlight + 1 : this.highlight - 1;
		// 	}
		// }
		switch (key) {
			case Key.UP:
				if (this.highlight !== null && this.highlight >= 0) {
					this.highlight--;
					if (this.highlight >= 0) {
						this.moveHighlightAmongChildren(key);
					}
				} else if (this.parent) {
					this.parent.moveHighlightHelper(key);
				}
				break;
			case Key.DOWN:
				if (this.highlight !== null && this.highlight < this.files.length + this.subDirs.length - 1) {
					this.highlight++;
					this.moveHighlightAmongChildren(key);
				} else if (this.parent) {
					this.parent.moveHighlightHelper(key);
				}
				break;
			case Key.LEFT:
				if (this.parent) {
					this.parent.setExpanded(false);
					this.parent.removeHighlight();
					this.parent.moveHighlight(key);
				}
				break;
		}
	}

	public moveHighlight(key: Key): void {
		if (this.highlight === null) {
			this.highlight = -1;
		} else {
			switch (key) {
				case Key.UP:
					if (this.shouldHighlightThis()) {
						if (this.parent) {
							this.highlight = null;
							this.parent.moveHighlightHelper(key);
						}
					} else {
						this.moveHighlightAmongChildren(key);
					}
					break;
				case Key.DOWN:
						if (this.expanded) {
							this.moveHighlightAmongChildren(key);
						} else if (this.parent && !this.expanded) {
							this.highlight = null;
							this.parent.moveHighlightHelper(key);
						}
					break;
				case Key.RIGHT:
					if (this.expanded && !this.shouldHighlightThis()) {
						this.moveHighlightAmongChildren(key);
					} else if (!this.expanded && this.shouldHighlightThis()) {
						this.setExpanded(true);
					}
					break;
				case Key.LEFT:
					if (this.expanded && this.shouldHighlightThis()) {
						this.setExpanded(false);
					} else if (this.expanded) {
						this.moveHighlightAmongChildren(key);
					} else if (!this.expanded && this.shouldHighlightThis()) {
						this.moveHighlightHelper(key);
					}
					break;
			}
		}
	}

	public shouldHighlightThis(): boolean {
		return this.highlight !== null && this.highlight < 0;
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

export class ReactDirectory extends ReactFileSystemNode<IReactDirectoryProps, IReactDirectoryState> {
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
		state.margin = 0;
		this.props.dir.toggleExpanded();
		this.setState(state);
	}

	private mouseDown(): void {
		const state: IReactDirectoryState = Object.assign({}, this.state);
		state.margin = Constants.LIST_ELEMENT_NEW_LINE_PX_COUNT;
		this.setState(state);
	}

	protected createReactNode(): ReactNode {
		const name: string = this.props.dir.getName() + "/";
		const style = {marginLeft: (this.props.level * Constants.LIST_ELEMENT_NEW_LINE_PX_COUNT) + this.state.margin + "px"};
		return(this.state.onScreen || this.props.active ?
			<div
				style={{display: "block", marginBottom: this.props.level === 0 ? "1em" : 0,}}
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
						fontSize: ReactFileSystemNode.getFontSize(name),
					}}
					onClick={this.toggleExpanded}
					onMouseDown={this.mouseDown}
				>
					{name}
				</div>
				{this.props.dir.getDirectories()
					.map((dir: Directory, i: number) => <ReactDirectory dir={dir} level={this.props.level + 1} key={i} active={this.props.expanded && this.props.active} highlight={dir.shouldHighlightThis()} expanded={dir.isExpanded()}/>)}
				{this.props.dir.getFiles()
					.map((file: File, i: number) => <ReactFile file={file} level={this.props.level + 1} key={i} active={this.props.expanded && this.props.active} highlight={file.shouldHighlightThis()}/>)}

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