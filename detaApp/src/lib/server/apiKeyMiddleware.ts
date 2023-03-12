import type { IApiKey } from "$lib/types/IApiKey";
import type { IProject } from "$lib/types/IProject";
import { db_apiKeys, db_projects } from "./deta";
import { respondUnauthenticated } from "./responseHelper";

/**
 * Should be called at the beginning of every authenticated route.
 * Checks if the X-API-Key is valid project key.
 * ! Throws response if key is invalid.
 * @param request 
 * @param projectId 
 * @returns Promise that resolves to the project the key is valid for.
 */
export async function apiKeyMiddleware(request: Request, projectId: string): Promise<IProject> {
    const API_KEY = request.headers.get("X-API-Key");
    if (!API_KEY) throw respondUnauthenticated("Missing X-API-Key header!");

    const p_project = (db_projects.get(projectId)) as Promise<IProject | null>;
    const p_key = (db_apiKeys.get(API_KEY)) as Promise<IApiKey | null>;
    const [project, dbKey] = await Promise.all([p_project, p_key]);

    if (!dbKey || !project) throw respondUnauthenticated("Invalid API key!");
    return project;
}