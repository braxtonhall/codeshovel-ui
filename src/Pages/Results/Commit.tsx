import {FadeableElement, IFadeableElementProps, IFadeableElementState} from "../../FadeableElement";
import {Constants} from "../../Constants";
import {ReactNode} from "react";
import * as React from "react";
import {ICommitx} from "../../Types";
import {Changes} from "../../Enums";

export class ReactCommit extends FadeableElement<IReactCommitProps, IReactCommitState> {
	protected readonly fadeOutTime: number = 300;
	private diffDeleter: any = undefined;
	private datec: string = "";
	private authc: string = "";
	private filec: string = "";
	private comtc: string = "";
	private detlc: string = "";
	private typec: string = "";

	constructor(props: IReactCommitProps) {
		super(props);
		this.state = {onScreen: this.props.active, expanded: false, diffVisible: false};
		this.setUpColours();
		this.goToCommit = this.goToCommit.bind(this);
		this.mouseDown = this.mouseDown.bind(this);
		this.goToFileInCommit = this.goToFileInCommit.bind(this);
		this.toggleExpanded = this.toggleExpanded.bind(this);
		this.getClassName = this.getClassName.bind(this);
		this.getDate = this.getDate.bind(this);
		this.getHeight = this.getHeight.bind(this);
		this.enableDiff = this.enableDiff.bind(this);
		this.getBackgroundImage = this.getBackgroundImage.bind(this);
		this.getFontSize = this.getFontSize.bind(this);
	}

	private setUpColours(): void {
		let temp = Math.floor(Math.random() * Constants.COMMIT_CELL_COLOUR_VARIANCE_PCT);
		this.datec = temp < 10 ? "0" + temp : "" + temp;
		temp = Math.floor(Math.random() * Constants.COMMIT_CELL_COLOUR_VARIANCE_PCT);
		this.authc = temp < 10 ? "0" + temp : "" + temp;
		temp = Math.floor(Math.random() * Constants.COMMIT_CELL_COLOUR_VARIANCE_PCT);
		this.filec = temp < 10 ? "0" + temp : "" + temp;
		temp = Math.floor(Math.random() * Constants.COMMIT_CELL_COLOUR_VARIANCE_PCT);
		this.comtc = temp < 10 ? "0" + temp : "" + temp;
		temp = Math.floor(Math.random() * Constants.COMMIT_CELL_COLOUR_VARIANCE_PCT);
		this.detlc = temp < 10 ? "0" + temp : "" + temp;
		temp = Math.floor(Math.random() * Constants.COMMIT_CELL_COLOUR_VARIANCE_PCT);
		this.typec = temp < 10 ? "0" + temp : "" + temp;
	}

	private goToCommit(): void {
		const baseUrl: string = this.props.repo.replace(".git", "");
		const link: string = `${baseUrl}/commit/${this.props.commit.commitName}`;
		if(baseUrl !== "") {
			window.open(link, "_blank");
		}
	}

	private goToFileInCommit(): void {
		console.log(this.props.repo);
		const baseUrl: string = this.props.repo.replace(".git", "");
		const link: string = `${baseUrl}/blob/${this.props.commit.commitName}/${this.props.commit.file}`;
		if(baseUrl !== "") {
			window.open(link, "_blank");
		}
	}

	private getBackgroundImage(): string {
		let change = this.props.commit.type;
		if (change.startsWith(Changes.MULTI_CHANGE)) {
			change = Changes.MULTI_CHANGE;
		}
		return Constants.CHANGE_IMAGES[change];
	}

	private getChangeType(): string {
		let change = this.props.commit.type;
		if (change.startsWith(Changes.MULTI_CHANGE)) {
			change = Changes.MULTI_CHANGE;
		}
		return Constants.CHANGE_TYPES[change];
	}

	private getClassName(): string {
		let change = this.props.commit.type;
		if (change.startsWith(Changes.MULTI_CHANGE)) {
			change = Changes.MULTI_CHANGE;
		}
		return change;
	}

	private mouseDown(): void {
		// const state: IReactCommitState = Object.assign({}, this.state);
		// state.margin = Constants.LIST_ELEMENT_NEW_LINE_PX_COUNT;
		// this.setState(state);
	}

	private getDate(): string {
		const date: Date = new Date(this.props.commit.commitDate);
		if (date.toDateString() === 'Invalid Date') {
			return "?";
		} else {
			return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
		}
	}

	private getHeight(baseOnly: boolean = false): string {
		let height: number = this.props.windowHeight * 0.01 * Constants.COMMIT_ROW_HEIGHT;
		if (baseOnly) {
			return height + "px";
		}
		const diff: Element | null = document.getElementById(this.props.commit.commitName);
		height = this.state.expanded ? height * 2 : height;
		height = diff ? height + diff.clientHeight : height;
		return height + "px";
	}

	private getFontSize(s: string): string {
		return (this.props.windowWidth * (1 / Math.max(s.length, 5)) * 0.01 * Constants.COMMIT_FONT_APPROX_SIZE) + "px";
	}

	private enableDiff(): void {
		if (this.state.expanded) {
			const state: IReactCommitState = Object.assign({}, this.state);
			state.diffVisible = true;
			this.setState(state);
		}
	}

	private toggleExpanded(): void {
		const state: IReactCommitState = Object.assign({}, this.state);
		state.expanded = !state.expanded;
		if (state.expanded) {
			// TODO not this
			if (this.props.commit.diff) {
				/* eslint-disable */
				// @ts-ignore
				const diffDrawer = new Diff2HtmlUI({diff: "--- a/file.fake\n+++ b/file.fake\n" + this.props.commit.diff});
				diffDrawer.draw(`#${this.props.commit.commitName}`, {inputFormat: 'diff', showFiles: false, matching: 'lines', outputFormat: 'line-by-line'});
				diffDrawer.highlightCode(`#${this.props.commit.commitName}`);
				if (this.diffDeleter) {
					clearTimeout(this.diffDeleter);
				}
				setTimeout(this.enableDiff, this.fadeOutTime);
			}
		} else {
			state.diffVisible = false;
			this.diffDeleter = setTimeout(() => {
				const element = document.getElementById(this.props.commit.commitName);
				if (element) {
					element.innerHTML = "<div/>";
				}
				this.diffDeleter = undefined;
				this.forceUpdate();
			}, this.fadeOutTime);
		}
		this.setState(state);
	}

	protected createReactNode(): ReactNode {
		const date = this.getDate();
		const author = this.props.commit.commitAuthor;
		const change = this.getChangeType();
		return(
			<div
				style={{display: "block", alignItems: "center"}}
			>
				<div
					className={this.getClassName()}
					style={{
						margin: "0 auto",
						marginTop: "3px",
						marginBottom: "3px",
						textAlign: "left",
						height: this.getHeight(),
						font: Constants.FONT,
						width: (Constants.COMMIT_ROW_WIDTH + (this.state.expanded ? Constants.COMMIT_WIDTH_MODIFIER : 0)) + "%",
						overflow: "hidden",
						zIndex: 9999,
						transition: this.fadeOutTime + "ms ease-in-out",
					}}
					onMouseDown={this.mouseDown}
				>
					<div
						style={{
							margin: "0 auto",
							display: "grid",
							gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
							height: this.getHeight(true)
						}}
					>
						<div className="CommitRowCell" style={{fontSize: this.getFontSize(date), backgroundColor: `rgba(255, 255, 255, 0.${this.datec})`}}>
							{date}
						</div>
						<div className="CommitRowCell" style={{fontSize: this.getFontSize(author), backgroundColor: `rgba(255, 255, 255, 0.${this.authc})`}}>
							{author}
						</div>
						<div className="CommitRowCell" style={{fontSize: this.getFontSize(change), backgroundColor: `rgba(255, 255, 255, 0.${this.typec})`}}>
							{change}
						</div>
						{this.props.repo.replace(".git", "") !== "" ?
							<div className="CommitRowCell" onClick={this.goToCommit} style={{backgroundColor: `rgba(255, 255, 255, 0.${this.comtc})`}}>
								View<br/>{this.props.commit.commitName.substring(34)}
							</div> : <div/>
						}
						{this.props.commit.file && this.props.repo.replace(".git", "") !== "" ?
							<div className="CommitRowCell" onClick={this.goToFileInCommit} style={{backgroundColor: `rgba(255, 255, 255, 0.${this.filec})`}}>
								View<br/>File
							</div> : <div/>
						}
						<div className="CommitRowCell" onClick={this.toggleExpanded} style={{backgroundColor: `rgba(255, 255, 255, 0.${this.detlc})`}}>
							Details
						</div>
					</div>
					<div
						id={this.props.commit.commitName}
						style={{
							width: "90%",
							margin: "0 auto",
							opacity: this.state.diffVisible ? 1 : 0,
							transition: this.fadeOutTime + "ms ease-in-out"
						}}
					/>
					<div
						style={{
							height: this.state.expanded ? this.getHeight(true) : 0,
							backgroundImage: this.getBackgroundImage(),
							opacity: this.state.expanded ? 0.5 : 0,
							backgroundSize: (this.props.windowHeight * 0.04 * Constants.COMMIT_ROW_HEIGHT) + "px",
							backgroundRepeat: "no-repeat",
							backgroundPosition: "left",
							transition: this.fadeOutTime + "ms ease-in-out",
						}}
					>
						<div
							style={{

							}}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export interface IReactCommitProps extends IFadeableElementProps {
	commit: ICommitx;
	repo: string;
	windowHeight: number;
	windowWidth: number;
}

export interface IReactCommitState extends IFadeableElementState {
	expanded: boolean;
	diffVisible: boolean;
}
