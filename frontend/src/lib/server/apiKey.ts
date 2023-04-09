import type { IProject } from "$lib/types/IProject";
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
