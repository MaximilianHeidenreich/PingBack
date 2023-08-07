import { Invalid, InvalidZod } from "$lib/errors/core";
import { ZApiKeyDisplayName, type IApiKey } from "$lib/types/IApiKey";
import { ZProjectKey, type IProject } from "@pingback/shared";
import { z } from "zod";
import { db_apiKeys, db_projects } from "./deta";
import { respondUnauthenticated } from "./responseHelper";

/**
 * Should be called at the beginning of every authenticated route.
 * Checks if the X-API-Key is valid project key.
 * @param request
 * @param projectId
 * @returns Promise that resolves to the project the key is valid for.
 */
export async function validateApiKey(request: Request, projectId: string): Promise<{ valid: true, project: IProject } | { valid: false, response: Response }> {
    const API_KEY = request.headers.get("X-API-Key");
    if (!API_KEY) throw respondUnauthenticated("Missing X-API-Key header!");

    const [project, dbKey] = await Promise.all([
        db_projects.get(projectId),
        db_apiKeys.get(API_KEY)
    ]);

    // TODO: Check key permissions

    if (!dbKey || !project) return { valid: false, response: respondUnauthenticated("Invalid API key!") };
    return { valid: true, project };
}

export interface ICreateApiKey {
    key?: string;
    displayName: string;
    project: string;
}

export const ZCreateApiKey = z.object({
    key: z.string().uuid().optional().default(() => crypto.randomUUID()),
    createdAt: z.number().optional().default(Date.now),
    displayName: ZApiKeyDisplayName,
    project: ZProjectKey
});

// TODO: Docs
export async function server_CreateApiKey(apiKey: ICreateApiKey): Promise<IApiKey> {
    // Parse project args
    const parseRes = ZCreateApiKey.safeParse(apiKey);
    if (!parseRes.success) throw new InvalidZod("Invalid data", parseRes.error);
    const parsedKey = parseRes.data;

    // Try insert
    let newApiKey;
    try {
        newApiKey = await db_apiKeys.insert(parsedKey, parsedKey.key);
    } catch (e) {
        throw new Invalid("API Key already exists!"); // FIX: Correct error & ret key
    }

    return newApiKey;
}
