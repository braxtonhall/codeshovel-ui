import {FadeableElement, IFadeableElementProps, IFadeableElementState} from "../../FadeableElement";
import {ReactNode} from "react";
import * as React from "react";
import {IChange, ICommit, ICommitx, IHistoryTransport} from "../../Types";
import {ReactCommit} from "./Commit";
import {Changes} from "../../Enums";
import {Constants} from "../../Constants";

export class History {
	private commits: ICommitx[];

	constructor(history: IHistoryTransport, startFile: string) {
		this.commits = History.buildCommits(history, startFile);
	}

	private static buildCommits(history: IHistoryTransport, startFile: string): ICommitx[] {
		const commits: ICommitx[] = Array.from(Object.values(history)).slice();
		let file: string | undefined = startFile;
		for (const commit of commits) {
			commit["file"] = file;
			if (commit.type === Changes.FILE_RENAME || commit.type === Changes.MOV_FROM_FILE) {
				file = commit.extendedDetails.oldPath;
			} else if (commit.type.startsWith(Changes.MULTI_CHANGE)) {
				if (commit.subchanges) {
					for (const change of commit.subchanges) {
						if (change.diff) {
							commit.diff = change.diff;
							break;
						}
					}
				}
				if (commit.type.includes(Changes.FILE_RENAME) || commit.type.includes(Changes.MOV_FROM_FILE)) {
					const subChanges: IChange[] = commit.subchanges ? commit.subchanges : [];
					for (const subChange of subChanges) {
						if (subChange.type === Changes.FILE_RENAME || subChange.type === Changes.MOV_FROM_FILE) {
							file = subChange.extendedDetails.oldPath;
							break;
						}
					}
				}
			}

		}
		if (commits.length >= 2) {
			for (let i = commits.length - 2; i >= 0; i--) {
				if (commits[i].diff) {
					commits[commits.length - 1].diff = History.buildFirstDiff(commits[i].diff);
					break;
				}
			}
		}
		return commits;
	}

	private static buildFirstDiff(oldDiff: string | undefined): string | undefined {
		if (!oldDiff) {
			return oldDiff;
		}
		const oldLines: string[] = oldDiff.split('\n');
		const newLines: string[] = [];
		for (const line of oldLines) {
			if (line.startsWith('+')) {
				// Do nothing
			} else if (line.startsWith('@@') || line.startsWith('\\ No newline at end of file')) {
				newLines.push(line);
			} else {
				newLines.push('+' + line.substring(1));
			}
		}
		if (newLines.length < 2) {
			return undefined;
		}
		newLines[0] = `@@ -1,0 +1,${newLines.length - 3} @@`;
		newLines[newLines.length - 1] = "";
		return newLines.join('\n');
	}

	public getCommits(): ICommit[] {
		return this.commits.slice();
	}
}

export class ReactHistory extends FadeableElement<IReactHistoryProps, IReactHistoryState> {
	protected readonly fadeOutTime: number = 300;


	constructor(props: IReactHistoryProps) {
		super(props);
		this.state = {onScreen: this.props.active};
	}


	protected createReactNode(): ReactNode {
		const marginTop: number = Math.log(this.props.windowHeight) * Constants.COMMIT_ROW_HEIGHT + 3;
		return(
			<div>
				<div
					className="Panel"
					style={{
						marginTop,
						display: "block",
						width: "100%",
						marginBottom: "1em",
						overflowY: "scroll",
					}}
				>
					{
						this.props.history.getCommits().map((commit: ICommit) => {
							return <ReactCommit commit={commit} key={commit.commitName} active={this.props.active} repo={this.props.repo} windowHeight={this.props.windowHeight} windowWidth={this.props.windowWidth}/>;
						})
					}
				</div>
			</div>
		);
	}
}

export interface IReactHistoryProps extends IFadeableElementProps {
	history: History;
	repo: string;
	windowHeight: number;
	windowWidth: number;
}

export interface IReactHistoryState extends IFadeableElementState {

}
