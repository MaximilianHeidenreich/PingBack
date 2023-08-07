import { db_apiKeys } from "$lib/server/deta";
import type { IApiKey } from "@pingback/shared";
import type { PageServerLoad } from "./$types";

export const load = (async ({  }) => {

    // Get default api key.
    let defaultApiKey: IApiKey | undefined;
    try {
        const res = await db_apiKeys.fetch({ displayName: "default" }, { limit: 1 });
        if (res.count >= 0) defaultApiKey = res.items[0];
    } catch (e) {
        console.error(e);
    }

    if (!defaultApiKey) {
        const apiKey = crypto.randomUUID();
        try {
            const res = await db_apiKeys.put({
                key: apiKey,
                createdAt: Date.now(),
                displayName: "default",
                project: "default"
            }, apiKey);
            defaultApiKey = res;
        } catch (e) {
            console.error(e);
        }
    }

    return {
        defaultApiKey
    };
}) satisfies PageServerLoad;
