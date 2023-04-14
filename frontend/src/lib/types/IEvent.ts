import { z } from "zod";
import nodeEmoji from "node-emoji";

/**
 * Parser to use when displaying event description.
 *
 * log -> special type, will use text description but apply special format in ui
 */
export type TEventParser = "text" | "markdown" | "json" | "log";

/**
 * A single, immutable "thing that happened at a point in time".
 */
export interface IEvent {
    // META
    key: string; // Unique key for event
    v: number; // Version of application -> used for migrations TODO: Only major version
    createdAt: number; // Unix timestamp

    project: string; // Project associated with event
    channel: string; // Channel in project associated with event
    name: string; // Event name -> declarative, searchable, can "subdivide" events  e.g. "deploy", "deploy.success", "user.signup", "user.signout"
    notify?: boolean; // Whether to notify clients of event
    icon?: string; // Icon to use when displaying event -> Emoji or TODO: Build-in icons? svg allow? img url?
    parser: TEventParser; // Parser to use when displaying event description

    // PAYLOAD
    title: string; // Title of event
    description: unknown; // Description of event
    tags: Record<string, unknown>; // Tags (json data) associate with event -> can be used for filtering
}

// SCHEMAS
export const ZEventKey = z.string()
    .uuid();
export const ZEventName = z.string()
    .min(1)
    .max(50)
    .regex(/[a-zA-Z0-9._-]+/)
    .transform((s) => s.toLowerCase());

// TODO!: Add http://www.emoji-cheat-sheet.com/ to docs
export const ZEventIcon = z.preprocess(s => {
    s = String(s);
    if ((s as string).includes(":")) {
        s = nodeEmoji.get(s as string);
    }
    return s;
}, z.string().emoji());

// export const ZEventIcon = z.string()
//     .tr
//     .emoji();
export const ZEventTitle = z.string()
    .min(1)
    .max(25);
