import { localStorable } from "./localStorable";

export const s_pushNotificationsEnabled = localStorable<boolean>(false, "pb_pushNotificationsEnabled");

