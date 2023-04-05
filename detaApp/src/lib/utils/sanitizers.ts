/**
 * Sanitizes input to only contain alphanumeric characters, dashes, and underscores.
 * @param input
 * @returns
 */
export function sanitizeProjectIdInput(input: string): string {
    let sane = input
        .trimStart()
        .replace(/\s+/g, "-")
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
export function sanitizeChannelID(input: string): string {
    let sane = input
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^0-9a-zA-Z-_]/g, "_")
        .replace(/\s+/g, " ");
    return sane;
}

// TODO: Docs & tests
export function sanitizeApiKeyName(input: string): string {
    let sane = input.trim();
    return sane;
}

// TODO: Docs & test
export function sanitizeApiKeyNameInput(input: string): string {
    let sane = input.trimStart();
    if (sane.length > 25) sane = sane.substring(0, 25);
    return sane;
}
