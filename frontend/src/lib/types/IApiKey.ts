import { z } from "zod";

/**
 * API Key Permissions can be used to restrict access to the API.
 */
export type TApiKeyPermission =
    | "event:create"
    | "event:query"
    | "event:update"
    | "event:delete"
    | "project:create"
    | "project:query"
    | "project:update"
    | "project:delete";

/**
 * Api Key used to authenticate with the API.
 */
export interface IApiKey {
    // META
    key: string; // Unique key -> ! Mirrors deta base "key" field
    createdAt: number; // Unix timestamp
    displayName: string; // TODO: Rename to name
    project: string; // Project for which key is valid
}

export const ZApiKeyDisplayName = z.string()
    .min(1)
    .max(25)
    .transform((s) => s.trim());
