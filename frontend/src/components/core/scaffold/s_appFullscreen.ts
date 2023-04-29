import { storedWritable } from "$lib/stores/storedWritable";

export const s_appFullscreen = storedWritable<boolean>("pb_appFullscreen", false);
