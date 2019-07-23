export interface IMethodTransport {
	longName: string;
	startLine: number;
	methodName: string;
	isStatic: boolean;
	isAbstract: boolean;
	visibility: "public" | "private" | "protected" | "";
}

export interface IHistoryTransport {
	[sha: string]: ICommit
}

export interface ICommit {
	type: string;
	commitMessage: string;
	commitDate: string; // new Date('2/20/16 8:25 PM') or Date.parse('2/20/16 8:25 PM') for just a number
	commitName: string;
	commitAuthor: string;
	commitDateOld?: string,
	commitNameOld?: string;
	commitAuthorOld?: string;
	daysBetweenCommits?: number;
	commitsBetweenForRepo?: number;
	commitsBetweenForFile?: number;
	diff?: string;
	extendedDetails?: any;
	subchanges?: any[];
}

export interface ICommitx extends ICommit{
	file?: string;
}

export class ServerBusyError extends Error {
	constructor(...args: any[]) {
		super(...args);
		Error.captureStackTrace(this, ServerBusyError);
	}
}

export class InternalError extends Error {
	constructor(...args: any[]) {
		super(...args);
		Error.captureStackTrace(this, InternalError);
	}
}

export class EmptyError extends Error {
	constructor(...args: any[]) {
		super(...args);
		Error.captureStackTrace(this, InternalError);
	}
}
