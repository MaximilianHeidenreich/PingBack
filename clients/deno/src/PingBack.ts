import { TEventParser } from "./types/TEventParser.ts";

export interface IPingBackOptions {
    apiKey: string;
    appUrl: string;
    project: string;
}

export interface IPublishEventArgs {
    channel: string;
    event: string;
    title: string;
    description?: string;
    parser?: TEventParser;
    icon?: string;
    notify?: boolean;
    tags?: Record<string, unknown>;
}

export class PingBack {
    options: IPingBackOptions;
    constructor(options: IPingBackOptions) {
        this.options = options;
        // TOOD: Test if key is valid and appUrl is reachable
    }

    async publishEvent(event: IPublishEventArgs, silent = false) {
        event.description = event.description || "";
        event.parser = event.parser || "text";
        event.notify = event.notify || true;
        event.tags = event.tags || {};
        // @ts-ignore - This is a hack to make the compiler happy, can be solved in future by ceating new obj
        event.project = this.options.project;
        const url = new URL(`/api/events`, this.options.appUrl);
        const responsePromise = fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Api-Key": this.options.apiKey,
            },
            body: JSON.stringify(event),
        });
        if (silent) return;

        const response = await responsePromise;
        console.log(response);
        
        let body: { ok: boolean, error?: unknown, data?: unknown } | undefined = undefined;
        if (response.headers.get("content-type")?.startsWith("application/json")) {
            body = await response.json();
        }
        console.log(body);
        if (!response.status.toString().startsWith("2")) {
            if (body) throw new Error(`PingBack: ${body.error}`);
        }
    }
}