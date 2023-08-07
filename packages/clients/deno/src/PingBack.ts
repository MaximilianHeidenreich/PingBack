import { ICreateEvent } from "../../../shared/src/types/event.types.ts";
import { PResult } from "../../../shared/src/types/result.types.ts";

export type PingBackOptions = {
    apiKey: string;
    appUrl: string;
    project?: string;
}

export class PingBack {

    options: PingBackOptions;
    url_publishEvent: URL;

    constructor(options: PingBackOptions) {
        this.options = options;
        this.url_publishEvent = new URL(`/api/events`, this.options.appUrl);
        // todo: test if key is valid and appUrl is reachable
    }

    async publishEvent(event: ICreateEvent): PResult<{ data: unknown }, { message: string }> {
        event.notify = event.notify || true;
        event.tags = event.tags || {};

        if (!event.project) {
            if (!this.options.project) return { ok: false, message: "No project specified" };
            event.project = this.options.project;
        }

        const response = await fetch(this.url_publishEvent, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Api-Key": this.options.apiKey,
            },
            body: JSON.stringify(event),
        });

        let body: { ok: boolean; error?: unknown; data?: unknown } | undefined = undefined;
        if (response.headers.get("content-type")?.startsWith("application/json")) {
            body = await response.json();
        }
        console.log(body);
        if (!response.status.toString().startsWith("2")) {
            return { ok: false, message: body?.error as string };
        }

        return { ok: true, data: body?.data };
    }
}