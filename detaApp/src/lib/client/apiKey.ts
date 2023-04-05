import { NotFound } from "$lib/errors/core";
import type { TFetcher } from "$lib/types/fetcher";
import type { IApiKey } from "$lib/types/IApiKey";
import { VERSION } from "$lib/utils/version";

export interface ICreateApiKey {
    project: string;    // Project key for which key is valid
    displayName: string;// Name to know what it is for
}

// TODO: Doc
export async function client_CreateApiKey(
    fetcher: TFetcher,
    apiKey: ICreateApiKey
): Promise<IApiKey> {
    const url = new URL(`/api/v${VERSION.major}/apiKeys`, window.location.origin);
    const res = await fetcher(url, {
        method: "POST",
        headers: {
            "Accept": "application/json",
        },
        body: JSON.stringify(apiKey)
    });
    if (!res.ok) {
        if (res.status === 404) throw new NotFound(res.statusText);
        throw res;
    }
    const data = await res.json();
    return data;
}

/**
  * Deletes an api key.
  */
export async function client_DeleteApiKey(
    fetcher: TFetcher,
    apiKey: string
): Promise<void> {
    const url = new URL(`/api/v${VERSION.major}/apiKeys/${apiKey}`, window.location.origin);
    const res = await fetcher(url, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
        }
    });
    if (!res.ok) {
        if (res.status === 404) throw new NotFound(res.statusText);
        throw res;
    }
    const data = await res.json();
    return data;
}
