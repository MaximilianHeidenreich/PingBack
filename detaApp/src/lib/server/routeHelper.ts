import type { IError, IResponse } from "$lib/api/IResponse";
import { isApiKeyValid } from "./apiKey";

export function buildResponse() {
	class ResponseBuilder {
		body: string | IResponse | IError | null;
		headers: Map<string, string>;
		statusTmp: number;
		statusTextTmp: string | undefined;
		constructor() {
			this.body = null;
			this.headers = new Map();
			this.statusTmp = 200;
			this.statusTextTmp = undefined;
		}

		build(): Response {
			const response = new Response(JSON.stringify(this.body), {
				status: this.statusTmp,
				statusText: this.statusTextTmp,
				headers: Object.fromEntries(this.headers)
			});
			return response;
		}

		json(data: IResponse | IError): ResponseBuilder {
			this.body = data;
			this.headers.set("content-type", "application/json");
			return this;
		}
		text(data: string): ResponseBuilder {
			this.body = data;
			this.headers.set("content-type", "text/plain");
			return this;
		}
		header(name: string, value: string): ResponseBuilder {
			this.headers.set(name, value);
			return this;
		}
		status(statusCode: number): ResponseBuilder {
			this.statusTmp = statusCode;
			return this;
		}
		statusText(statusText: string): ResponseBuilder {
			this.statusTextTmp = statusText;
			return this;
		}
	}
	return new ResponseBuilder();
}

export async function validApiKey(request: Request, project: string): Promise<boolean> {
	const API_KEY = request.headers.get("X-API-Key");
	if (!API_KEY) return false;
	if (!(await isApiKeyValid(API_KEY, project))) return false;
	return true;
}
