import type { IResponse } from "$lib/api/IResponse";
import { deta } from "$lib/server/deta";
import type { IEvent } from "$lib/types/IEvent";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "../$types";

const db_events = deta.Base("events");

export const GET = (async ({ url, params }) => {
	const { eventID } = params;

	let event: IEvent | null;
	try {
		event = (await db_events.get(eventID)) as IEvent | null;
	} catch (err) {
		console.error(err);
		throw error(500, "Could not fetch event!");
	}

	const response = new Response(JSON.stringify({ ok: true, data: event } as IResponse), {
		headers: {
			"content-type": "application/json"
		}
	});

	return response;
}) satisfies RequestHandler;
