import * as rp from "request-promise-native";
import {Constants} from "./Constants";
import {
	EmptyError,
	ICachedResponse,
	IHistoryTransport,
	IManifest,
	IMethodTransport,
	InternalError,
	ServerBusyError
} from "./Types";
import fetch from "node-fetch";

export class RequestController {
	private static readonly server: string = Constants.SERVER_ADDRESS;
	private static readonly opts: rp.RequestPromiseOptions = {
		rejectUnauthorized: false,
		strictSSL: false,
		method: 'get',
	};

	public static async getManifest(): Promise<IManifest> {
		return JSON.parse(await (await fetch(Constants.MANIFEST_PATH)).text());
	}

	public static async getExample(file: string): Promise<ICachedResponse> {
		return JSON.parse(await (await fetch(`/responses/${file}.json`)).text());
	}

	public static async getFiles(file: string): Promise<string[]> {
		return JSON.parse(await (await fetch(`/responses/${file}.json`)).text()).files;
	}

	public static async getMethods(file: string): Promise<IMethodTransport[]> {
		return JSON.parse(await (await fetch(`/responses/${file}.json`)).text()).methods;
	}

	public static async getAuthorUrl(org: string, repo: string, sha: string): Promise<string> {
		try {
			const response: any = await RequestController.request(`https://api.github.com/repos/${org}/${repo}/commits/${sha}`, {});
			return response.author.html_url as string;
		} catch (err) {
			throw new Error("Wasn't able to get the required information from GitHub");
		}
}

	public async listFiles(gitUrl: string, sha: string): Promise<string[]> {
		const url = RequestController.server + "/listFiles";
		const qs: {[key: string]: string | boolean} = {
			gitUrl,
			sha,
		};
		const files: string[] = (await RequestController.request(url, qs)).sort();
		if (files.length === 0) {
			throw new EmptyError("No java files found in this repo.")
		} else {
			return files;
		}
	}

	public async listMethods(gitUrl: string, sha: string, filePath: string): Promise<IMethodTransport[]> {
		const url = RequestController.server + "/listMethods";
		const qs: {[key: string]: string | boolean} = {
			gitUrl,
			sha,
			filePath
		};
		const methods: IMethodTransport[] = (await RequestController.request(url, qs)).sort((a: IMethodTransport, b: IMethodTransport) => {
			if (a.startLine < b.startLine) {
				return -1;
			} else if (a.startLine > b.startLine) {
				return 1;
			} else {
				return 0;
			}
		});
		if (methods.length === 0) {
			throw new EmptyError("No methods found in this file.")
		} else {
			return methods;
		}
	}

	public async getHistory(gitUrl: string, sha: string, filePath: string, startLine: number, methodName: string): Promise<IHistoryTransport> {
		const url = RequestController.server + "/getHistory";
		const qs: {[key: string]: string | boolean | number} = {
			gitUrl,
			sha,
			filePath,
			startLine,
			methodName
		};
		const history: IHistoryTransport = await RequestController.request(url, qs);
		if (Object.keys(history).length === 0) {
			throw new EmptyError("No changes found in this method.")
		} else {
			return history;
		}
	}

	public static async echo(msg: string = "echo"): Promise<string> {
		const url = RequestController.server + "/echo";
		const qs: {[key: string]: string} = { msg };
		return await RequestController.request(url, qs);
	}

	private static async request(url: string, qs: {[key: string]: string | boolean | number}): Promise<any> {
		try {
			// @ts-ignore
			return JSON.parse(await rp(url, {qs, ...RequestController.opts}));
		} catch (err) {
			console.log("RequestController::request - ERROR: " + err.message);
			if (err.statusCode === undefined || err.statusCode === 503) {
				throw new ServerBusyError("RequestController able to handle request.");
			} else {
				throw new InternalError("RequestController able to handle request.");
			}
		}
	}
}
