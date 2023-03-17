/**
 * Sanitizes input to only contain alphanumeric characters, dashes, and underscores.
 * @param input
 * @returns
 */
export function sanitizeProjectIdInput(input: string): string {
    let sane = input
        .trimStart()
        .trimEnd()
        .replace(/ +/, "-")
        .replace(/[^0-9a-zA-Z-_]/g, "_");
    return sane;
}

/**
 * Similar to sanitizeProjectIdInput but also converts to lowercase for db use & lookup.
 * @param input
 * @returns
 */
export function sanitizeProjectIdInternal(input: string): string {
    let sane = input
        .trimStart()
        .trimEnd()
        .toLowerCase()
        .replace(/ +/, "-")
        .replace(/[^0-9a-z-_]/g, "_");
    return sane;
}

/**
 * Sanitizes input to only contain lowercase alphanumeric characters, dashes, and underscores.
 * @param input
 * @returns
 */
export function sanitizeChannelName(input: string): string {
    let sane = input
        .toLowerCase()
        .replaceAll(" ", "-")
        .replace(/[^0-9a-zA-Z-_]/g, "_")
        .replace(/ +/, " ");
    return sane;
}
