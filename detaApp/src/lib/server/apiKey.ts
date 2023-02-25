import type { IApiKey, TApiKeyPermission } from "$lib/types/IApiKey";

import { deta } from "./deta";

/**
 * Checks whether the given API key is valid.
 * @param apiKey
 * @returns
 */
export async function isApiKeyValid(
    apiKey: string,
    project: string
): Promise<TApiKeyPermission[] | boolean> {
    const db_keys = deta.Base("apiKeys");
    const result = (await db_keys.get(apiKey)) as IApiKey | null;
    return result !== null && result.project === project;
}
