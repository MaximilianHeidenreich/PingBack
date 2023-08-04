import { InvalidZod } from "$lib/errors/core";
import { ZChannel, type IChannel } from "$lib/types/IChannel";
import { ZProjectDisplayName, ZProjectEventSpecifiers, ZProjectKey, type IProject } from "$lib/types/IProject";
import { z } from "zod";
import { server_CreateApiKey } from "./apiKey";
import { db_apiKeys, db_projects } from "./deta";


export interface ICreateProject {
    displayName: string,
    channels?: IChannel[]
}

export const ZCreateProject = z.object({
    key: ZProjectKey,
    displayName: ZProjectDisplayName,
    channels: z.array(ZChannel).optional().default([]),
    createdAt: z.number().optional().default(Date.now),
    
    contentHash: z.string().optional().default(() => crypto.randomUUID()),
    latestEventTimestamp: z.number().optional().default(-1),
    eventSpecifiers: ZProjectEventSpecifiers.optional().default({})
});

/**
  * Creates a new project with a "default" channel & api key.
  * @throws InvalidZod - If the provided data is invalid.
  * @throws Invalid - If the project does already exist.
  * TODO: throws DetaBaseError
  */
export async function server_CreateProject(project: ICreateProject): Promise<IProject> {
    // Parse project args
    const parseRes = ZCreateProject.safeParse(project);
    if (!parseRes.success) throw new InvalidZod("Invalid data", parseRes.error);
    const parsedProject = parseRes.data;
    if (!parsedProject.channels.find(e => e.id === "default"))
        parsedProject.channels.push({ id: "default", notify: true, latestEventTimestamp: -1 });

    // Try insert
    let newProject;
    try {
        newProject = await db_projects.insert(parsedProject, parsedProject.key);
    } catch (e) {
        throw new Invalid("Project already exists!"); // FIX: Correct error & ret key
    }

    // Create default API Key
    try {
        const newApiKey = await server_CreateApiKey({
            displayName: "default",
            project: parsedProject.key
        });
    } catch (e) {
        // NOTE: We don't throw because the project still got created.
        // TODO: Maybe catch warning event
        console.error(`Could not create default api key for project ${parsedProject.key}`, e);
    }

    return newProject;
}

/**
  * Deletes a project and all its associated remaining data (apiKeys, events...).
  * NOTE: Use migrate functions to migrate data before calling this!
  * TODO: impl delete events and other data 
  */
export async function server_DeleteProject(projectKey: string): Promise<void> {
    try {
        await db_projects.delete(projectKey);
    } catch (e) { throw e } // TODO: Handle

    const p_apikeys: Promise<null>[] = [];
    try {
        const apiKeys = await db_apiKeys.fetch({ project: projectKey }, {});
        for (const key of apiKeys.items) {
            p_apikeys.push(db_apiKeys.delete(key.key));
        }
        await Promise.all(p_apikeys);
    } catch (e) {
        console.error(e);
        throw e;
    }
}
