import type { IResponse } from "$lib/api/IResponse";
import { deta } from "$lib/server/deta";
import { buildResponse, validApiKey } from "$lib/server/routeHelper";
import type { IEvent } from "$lib/types/IEvent";
import type { IProject } from "$lib/types/IProject";
import { sanitizeProjectIdInternal } from "$lib/utils/sanitizers";
import { error } from "@sveltejs/kit";
import type { FetchResponse } from "deta/dist/types/types/base/response";
import type { RequestHandler } from "../$types";

const db_events = deta.Base("events");
const db_projects = deta.Base("projects");

export const GET = (async ({ url }) => {
	const queryRaw = url.searchParams.get("query") || undefined;
	const limit = url.searchParams.get("limit") || 50;
	const last = url.searchParams.get("last") || undefined;
	const day = url.searchParams.get("day") || undefined; // TODO: imple server side fetch for specific day ?

	let query: Record<string, unknown> | Record<string | number | symbol, never> = {};
	if (queryRaw) {
		try {
			query = JSON.parse(Buffer.from(queryRaw, "base64").toString()); //atob(queryRaw));
		} catch (err) {
			console.error(err);
			throw error(400, "Invalid query!");
		}
	}

	const queryOptions: { [key: string]: unknown } = {};
	if (limit) queryOptions["limit"] = Number(limit);
	if (last) queryOptions["last"] = last;

	let result: FetchResponse;
	try {
		//@ts-ignore - Deta SDK is shitting itself but we good :)
		result = await db_events.fetch(query, queryOptions);
	} catch (err) {
		console.error(err);
		throw error(500, "Internal error!");
	}

	const response = new Response(JSON.stringify({ ok: true, data: result } as IResponse), {
		headers: {
			"content-type": "application/json"
		}
	});

	return response;
}) satisfies RequestHandler;

export const POST = (async ({ url, request }) => {
	const reqBody = await request.json();
	const projectId = sanitizeProjectIdInternal(reqBody.project);

	if (!(await validApiKey(request, projectId))) {
		// TODO: improve -> We already fetch the project, so just return it for use in the route
		return buildResponse().status(401).json({ ok: false, error: "Unauthorized!" }).build();
	}

	// TODO: zod validate reqBody

	let project: IProject | undefined;
	{
		try {
			// @ts-ignore -> Deta SDK / TypeScript shitting itself but we good :)
			project = (await db_projects.get(projectId)) as IProject | undefined;
		} catch (err) {
			console.error(err);
			return buildResponse()
				.status(500)
				.statusText("Internal error!")
				.json({ ok: false, error: {} })
				.build();
		}
	}

	if (!project!.channels.find((c) => c.name === reqBody.channel)) {
		return buildResponse().status(404).json({ ok: false, error: "Channel not found!" }).build();
	}

	let pendingEvent: IEvent = {
		id: crypto.randomUUID(),
		createdAt: Date.now(),

		project: reqBody.project,
		channel: reqBody.channel,
		event: reqBody.event,
		notify: reqBody.notify,
		title: reqBody.title,
		description: reqBody.description,
		parser: reqBody.parser,
		icon: reqBody.icon,
		tags: reqBody.tags
	};

	try {
		// @ts-ignore -> Deta SDK shitting itself but we good :)
		await db_events.put(pendingEvent, pendingEvent.id);
	} catch (err) {
		console.error(err);
		throw error(500, "Internal error!");
	}

	// Update project details
	project!.latestEventTimestamp = pendingEvent.createdAt;
	{
		// @ts-ignore -> Deta SDK shitting itself but we good :)
		delete project!.key;
		try {
			// @ts-ignore -> Deta SDK shitting itself but we good :)
			await db_projects.update(project!, project.id);
		} catch (err) {
			console.error(err);
		}
	}

	const response = buildResponse().status(200).json({ ok: true, data: pendingEvent }).build();
	return response;
}) satisfies RequestHandler;
