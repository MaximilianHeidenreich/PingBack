import { storedWritable } from "./storedWritable";

export const s_pushNotificationsEnabled = storedWritable<boolean>("pb_pushNotificationsEnabled", false);

