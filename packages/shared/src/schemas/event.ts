import { z } from "zod";
import * as nodeEmoji from "node-emoji";
import { isValid } from "ulidx";

// SCHEMAS
export const ZEventKey = z.string().refine((val) => {
    return isValid(val);
}, {
  message: "Invalid ULID.",
});
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