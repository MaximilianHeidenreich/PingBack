/**
 * Parser to use when displaying event description.
 */
export type TEventParser = "text" | "markdown" | "json";

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
    eventName: string; // Event name -> declarative, searchable, can "subdivide" events  e.g. "deploy", "deploy.success", "user.signup", "user.signout"
    notify?: boolean; // Whether to notify clients of event
    icon?: string; // Icon to use when displaying event -> Emoji or TODO: Build-in icons? svg allow? img url?
    parser: TEventParser; // Parser to use when displaying event description

    // PAYLOAD
    title: string; // Title of event
    description: unknown; // Description of event
    tags: Record<string, unknown>; // Tags (json data) associate with event -> can be used for filtering
}
