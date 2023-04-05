import { localStorable } from "$lib/stores/localStorable";

export const s_eventListStyle = localStorable<"compact" | "card">("compact", "eventListStyle");
