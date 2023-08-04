import { storedWritable } from "./storedWritable";

export const s_timeFormat = storedWritable<"absolute" | "relative">("pb_timeFormat", "relative");
