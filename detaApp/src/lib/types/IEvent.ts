export type TEventParser = "text" | "markdown";

/**
 * A single "notification" / "log" / "thing that happened".
 */
export interface IEvent {
    // METADATA
    id: string; // Unique ID
    createdAt: number; // Unix timestamp

    // PAYLOAD
    project: string; // Project associated with this event
    channel: string; // Channel associated with this event
    event: string; // Event name -> unique, simple and searchable e.g. "user.signup", "payment.success", "deploy"
    notify: boolean; // Whether clients will be notified when event is created
    title: string; // Title of the event
    description: string; // Longer description -> Can include Markdown etc. (see parsers)
    parser: TEventParser; // Parser to use for the description
    icon: string; // Icon to display for this event
    tags: Record<string, unknown>; // Tags to associate with this event
}
