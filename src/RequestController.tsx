import * as rp from "request-promise-native";
import {Constants} from "./Constants";
import {EmptyError, IHistoryTransport, IMethodTransport, InternalError, ServerBusyError} from "./Types";

export class RequestController {
	private readonly server: string = Constants.SERVER_ADDRESS;
	private readonly opts: rp.RequestPromiseOptions = {
		rejectUnauthorized: false,
		strictSSL: false,
		method: 'get',
	};

	public async listFiles(gitUrl: string, sha: string): Promise<string[]> {
		const url = this.server + "/listFiles";
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
		const url = this.server + "/listMethods";
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
		const url = this.server + "/getHistory";
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

	private static async request(url: string, qs: {[key: string]: string | boolean | number}): Promise<any> {
		try {
			// @ts-ignore
			return JSON.parse(await rp(url, {qs, ...this.opts}));
		} catch (err) {
			console.log("RequestController::request - ERROR: " + err.message);
			if (err.statusCode === 503) {
				throw new ServerBusyError("RequestController able to handle request.");
			} else {
				throw new InternalError("RequestController able to handle request.");
			}
		}
	}
}
