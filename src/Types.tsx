export interface IMethodTransport {
	longName: string;
	startLine: number;
	methodName: string;
	isStatic: boolean;
	isAbstract: boolean;
	visibility: "public" | "private" | "protected" | "";
}

export interface IHistoryTransport {
	[sha: string]: IChange
}

export interface IChange {
	// TODO
}
