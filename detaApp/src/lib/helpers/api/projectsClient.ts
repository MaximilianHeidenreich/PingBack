import type { TFetcher } from "$lib/types/fetcher";
import type { IProject } from "$lib/types/IProject";
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