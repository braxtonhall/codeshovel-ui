import {FadeableElement, IFadeableElementProps, IFadeableElementState} from "../../FadeableElement";
import {Constants} from "../../Constants";
import {ReactNode} from "react";
import * as React from "react";
import {IChange, ICommitx} from "../../Types";
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
	private changes: IChange[];

	constructor(props: IReactCommitProps) {
		super(props);
		this.state = {onScreen: this.props.active, expanded: false, diffVisible: false};
		if (this.props.commit.type.startsWith(Changes.MULTI_CHANGE) && this.props.commit.subchanges) {
			this.changes = this.props.commit.subchanges;
		} else {
			this.changes = [this.props.commit]
		}
		this.setUpColours();
		this.goToCommit = this.goToCommit.bind(this);
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

	private getBackgroundImage(change?: string): string {
		if (!change) {
			change = this.props.commit.type;
		}
		if (change.startsWith(Changes.MULTI_CHANGE)) {
			change = Changes.MULTI_CHANGE;
		}
		return Constants.CHANGE_IMAGES[change];
	}

	private getChangeType(change?: string): string {
		if (!change) {
			change = this.props.commit.type;
		}
		if (change.startsWith(Changes.MULTI_CHANGE)) {
			change = Changes.MULTI_CHANGE;
		}
		return Constants.CHANGE_TYPES[change];
	}

	private getClassName(change?: string): string {
		if (!change) {
			change = this.props.commit.type;
		}
		if (change.startsWith(Changes.MULTI_CHANGE)) {
			change = Changes.MULTI_CHANGE;
		}
		return change;
	}

	private getDescription(ichange?: IChange): string {
		if (!ichange) {
			ichange = this.props.commit;
		}
		let change = ichange.type;
		if (change.startsWith(Changes.MULTI_CHANGE)) {
			change = Changes.MULTI_CHANGE;
		}
		switch (change) {
			case Changes.EXCEPS_CHANGE:
			case Changes.MOD_CHANGE:
				let oldVal = ichange.extendedDetails.oldValue;
				oldVal = oldVal.replace(/^\[/, "").replace(/]$/, "");
				let newVal = ichange.extendedDetails.newValue;
				newVal = newVal.replace(/^\[/, "").replace(/]$/, "");
				if (ichange.extendedDetails && ichange.extendedDetails.oldValue && ichange.extendedDetails.newValue) {
					const details = oldVal === "" ? ` Added \`${newVal}\`` : newVal === "" ? ` Removed \`${oldVal}\`` : `\`${oldVal}\` to \`${newVal}\``;
					return `${Constants.CHANGE_DESCRIPTIONS[change]}:${details}`;
				} else {
					break;
				}
			case Changes.FILE_RENAME:
			case Changes.MOV_FROM_FILE:
				if (ichange.extendedDetails && ichange.extendedDetails.oldPath && ichange.extendedDetails.newPath) {
					const oldFName = ichange.extendedDetails.oldPath.split('/').pop();
					const newFName = ichange.extendedDetails.newPath.split('/').pop();
					if (oldFName !== newFName) {
						return `${Constants.CHANGE_DESCRIPTIONS[change]}:\`${oldFName}\` to \`${newFName}\``;
					}
				}
				break;
			case Changes.PARAM_CHANGE:
			case Changes.PARAM_META_CHANGE:
				if (ichange.extendedDetails && ichange.extendedDetails.oldValue && ichange.extendedDetails.newValue) {
					let oldParams = ichange.extendedDetails.oldValue;
					oldParams = oldParams.replace(/^\[/, "(").replace(/]$/, ")");
					let newParams = ichange.extendedDetails.newValue;
					newParams = newParams.replace(/^\[/, "(").replace(/]$/, ")");
					return `${Constants.CHANGE_DESCRIPTIONS[change]}:\`${oldParams}\` to \`${newParams}\``;
				} else {
					break;
				}
			case Changes.RENAME:
			case Changes.RETURN_CHANGE:
				if (ichange.extendedDetails && ichange.extendedDetails.oldValue && ichange.extendedDetails.newValue) {
					return `${Constants.CHANGE_DESCRIPTIONS[change]}:\`${ichange.extendedDetails.oldValue}\` to \`${ichange.extendedDetails.newValue}\``;
				} else {
					break;
				}
			default:
				break;
		}
		return Constants.CHANGE_DESCRIPTIONS[change];
	}

	private getDate(): string {
		const date: Date = new Date(this.props.commit.commitDate);
		if (date.toDateString() === 'Invalid Date') {
			return "?";
		} else {
			const month: number = date.getMonth() + 1;
			const day: number = date.getDate();
			return `${date.getFullYear()}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
		}
	}

	private getTime(): string {
		const date: Date = new Date(this.props.commit.commitDate);
		if (date.toDateString() === 'Invalid Date') {
			return "";
		} else {
			const hours = date.getHours();
			const minutes = date.getMinutes();
			return `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}`;
		}
	}

	private getHeight(baseOnly: boolean = false, modifier: number = 1): string {
		let height: number = Math.log(this.props.windowHeight) * Constants.COMMIT_ROW_HEIGHT;
		if (baseOnly) {
			return (height * modifier) + "px";
		}
		const diff: Element | null = document.getElementById(this.props.commit.commitName);
		height = this.state.expanded ? height + (height * (this.changes.length + (diff && this.props.commit.diff ? 0.5 : 0))) : height;
		height = diff ? height + diff.clientHeight : height;
		return (height * modifier) + "px";
	}

	private getFontSize(s: string, modifier: number = 1): string {
		return (this.props.windowWidth * (1 / Math.max(s.length, 8)) * 0.01 * Constants.COMMIT_FONT_APPROX_SIZE * modifier) + "px";
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
				const diff = document.getElementById(this.props.commit.commitName);
				const rename = document.getElementById(this.props.commit.commitName + "rename");
				if (diff) {
					diff.innerHTML = "<div/>";
				}
				if (rename) {
					rename.innerHTML = "<div/>";
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
							{date}<br/>{this.getTime()}
						</div>
						<div className="CommitRowCell" style={{fontSize: this.getFontSize(author), backgroundColor: `rgba(255, 255, 255, 0.${this.authc})`}}>
							{author}
						</div>
						<div className="CommitRowCell" style={{fontSize: this.getFontSize(change), backgroundColor: `rgba(255, 255, 255, 0.${this.typec})`}}>
							{change}
						</div>
						{this.props.repo.replace(".git", "") !== "" ?
							<div className="CommitRowCell SubtleButton Underline" onClick={this.goToCommit} style={{backgroundColor: `rgba(255, 255, 255, 0.${this.comtc})`}}>
								View<br/>{this.props.commit.commitName.substring(34)}
							</div> : <div/>
						}
						{this.props.commit.file && this.props.repo.replace(".git", "") !== "" ?
							<div className="CommitRowCell SubtleButton Underline" onClick={this.goToFileInCommit} style={{backgroundColor: `rgba(255, 255, 255, 0.${this.filec})`}}>
								View<br/>File
							</div> : <div/>
						}
						<div className="CommitRowCell SubtleButton" onClick={this.toggleExpanded} style={{backgroundColor: `rgba(255, 255, 255, 0.${this.detlc})`}}>
							Details
						</div>
					</div>
					{
						this.changes.map((change, i) => {
							const desc: string = this.getDescription(change);
							return (<div
								className={this.getClassName(change.type)}
								style={{
									// width: this.changes.length > 1 ? "95%" : "100%",
									margin: "0 auto",
									height: this.state.expanded ? this.getHeight(true) : 0,
									backgroundImage: this.getBackgroundImage(change.type),
									opacity: this.state.expanded ? 0.8 : 0,
									backgroundSize: (this.props.windowHeight * 0.04 * Constants.COMMIT_ROW_HEIGHT) + "px",
									backgroundRepeat: "no-repeat",
									backgroundPosition: "left",
									transition: this.fadeOutTime + "ms ease-in-out",
									position: "relative",
									marginBottom: i === this.changes.length - 1 && this.props.commit.diff ? this.getHeight(true, 0.25) : "0",
								}}
								key={i}
							>
									{this.state.expanded ?
										<div
											style={{
												fontSize: this.getFontSize(desc, desc.length /  (Math.sqrt(desc.length) + 2)),
												textAlign: "right",
												position: "absolute",
												bottom: "0",
												right: "0"
											}}
										>
											{desc}
										</div> : <div style={{opacity: 0}}/>
									}
							</div>);
						})
					}
					<div
						id={this.props.commit.commitName}
						style={{
							width: "90%",
							margin: "0 auto",
							opacity: this.state.diffVisible ? 1 : 0,
							transition: this.fadeOutTime + "ms ease-in-out"
						}}
					/>
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
