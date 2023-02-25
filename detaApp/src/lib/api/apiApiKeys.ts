import type { IApiKey } from "$lib/types/IApiKey";

/**
 * Generator to fetch apiKeys.
 * @param limit Max number of apiKeys to fetch at once
 */
export async function *fetchApiKeys(limit: number = 20, query: unknown, useFetch?: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>) {
    let last = undefined;
    const request = async (lastKey: string | undefined, query: unknown | undefined): Promise<{ count: number, last: string | undefined, items: IApiKey[] }> => {
        if (!useFetch) useFetch = fetch;
        // TODO: Use built-in URL class
        let uri = `/api/keys?limit=${limit}`
        if (lastKey) uri += `&last=${lastKey}`;
        if (query) uri += `&query=${btoa(JSON.stringify(query))}`;
        
        const response = await useFetch(uri, {
            method: "GET"
        });
        const json = await response.json();
        
        last = json.data.last;
        return json.data;
    }

    yield await request(last, query);
    while (last) {
        yield await request(last, query);
    }
}
export async function fetchAllApiKeys(query?: unknown, useFetch?: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>) {
    if (!useFetch) useFetch = fetch;
    const keys: IApiKey[] = [];
    for await (const res of fetchApiKeys(100, query, useFetch)) {
        keys.push(...res.items);
    }
    return keys;
}

type TCreateApiKeyArgs = Pick<IApiKey, "name" | "project">;
export async function createApiKey(args: TCreateApiKeyArgs, useFetch?: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>) {
    if (!useFetch) useFetch = fetch;
    const response = await useFetch("/api/keys", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(args)
    });
    const json = await response.json();
    return json.data;
}

