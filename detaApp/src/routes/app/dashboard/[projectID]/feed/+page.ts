import { fetchAllEvents } from "$lib/api/apiEvents";
import { sanitizeProjectIdInternal } from "$lib/utils/sanitizers";
import type { PageLoad } from "./$types";

export const load = (async ({ params, fetch }) => {
	const events = await fetchAllEvents({ project: params.projectID }, fetch);

	return {
		projectId: sanitizeProjectIdInternal(params.projectID),
		events
	};
}) satisfies PageLoad;
