import { storedWritable } from "$lib/stores/storedWritable";

export const s_eventListStyle = storedWritable<"compact" | "card">("pb_eventListStyle", "compact");
