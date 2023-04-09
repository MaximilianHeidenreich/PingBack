import { localStorable } from "./localStorable";

export const s_clientId = localStorable<string>(crypto.randomUUID(), "pb_clientId_DONT_CHANGE");

