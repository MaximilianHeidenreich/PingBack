import { localStorable } from "./localStorable";

export const s_timeFormat = localStorable<"absolute" | "relative">("relative", "pb_timeFormat");