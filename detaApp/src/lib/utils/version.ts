
import { valid, clean, parse, major, minor, patch } from "semver";

if (!valid(__VERSION__)) throw new Error("Invalid app version string!"); // TODO: Better error handling.?

export const VERSION = Object.freeze({
    major: major(clean(__VERSION__)!),
    minor: minor(clean(__VERSION__)!),
    patch: patch(clean(__VERSION__)!),
    semver: parse(clean(__VERSION__)!)
});