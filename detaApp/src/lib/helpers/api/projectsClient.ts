import type { TFetcher } from "$lib/types/fetcher";
import type { IChannel } from "$lib/types/IChannel";
import type { IProject } from "$lib/types/IProject";
import { sanitizeChannelID, sanitizeProjectIdInternal } from "$lib/utils/sanitizers";
import { VERSION } from "$lib/utils/version";

/**
 * Raw fetch of projects based on query, lastKey, and limit.
 * @param fetcher SvelteKit fetch or default fetch.
 * @param query
 * @param lastKey
 * @param limit
 * @returns
 * @throws Fetch error.
 */
export async function clientFetchProjectsRaw(
    fetcher: TFetcher,
    query:
        | (Partial<IProject> & { [key: string]: unknown })
        | (Partial<IProject> & { [key: string]: unknown })[],
    lastKey?: string,
    limit?: number
): Promise<{ items: IProject[], count: number, last?: string }> {
    const url = new URL(`/api/v${VERSION.major}/projects`, window.location.origin);
    url.searchParams.set("query", btoa(JSON.stringify(query)));
    if (lastKey) url.searchParams.set("lastKey", lastKey);
    if (limit) url.searchParams.set("limit", limit.toString());

    const res = await fetcher(url, { method: "GET" });
    if (!res.ok) throw res;
    const data = await res.json();
    return data;
}


type TCreateProjectScaffold = Pick<IProject, "key" | "displayName">;
export async function clientCreateProjectRaw(
    fetcher: TFetcher,
    project: TCreateProjectScaffold
) {
    const res = await fetcher(`/api/v${VERSION.major}/projects`, {    // TODO: error handling
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(project)
    });
    return res;
}

export async function clientDeleteProjectRaw(
    fetcher: TFetcher,
    projectID: string
) {
    const res = await fetcher(`/api/v${VERSION.major}/projects/${sanitizeProjectIdInternal(projectID)}`, {    // TODO: error handling
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });
    return res;
}

type TCreateProjectChannelScaffold = Pick<IChannel, "id">;
export async function clientCreateProjectChannelRaw(
    fetcher: TFetcher,
    projectID: string,
    channel: TCreateProjectChannelScaffold
) {
    const res = await fetcher(`/api/v${VERSION.major}/projects/${sanitizeProjectIdInternal(projectID)}/channels`, {    // TODO: error handling
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(channel)
    });
    return res;
}

export async function clientDeleteProjectChannelRaw(
    fetcher: TFetcher,
    projectID: string,
    channelID: string
) {
    const res = await fetcher(`/api/v${VERSION.major}/projects/${sanitizeProjectIdInternal(projectID)}/channels/${sanitizeChannelID(channelID)}`, {    // TODO: error handling
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });
    return res;
}