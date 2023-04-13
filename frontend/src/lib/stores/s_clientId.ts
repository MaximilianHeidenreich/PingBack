import { storedWritable } from "./storedWritable";

export const s_clientId = storedWritable<string>("pb_clientId_DONT_CHANGE", crypto.randomUUID());

