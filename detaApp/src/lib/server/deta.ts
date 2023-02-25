import { env } from "$env/dynamic/private";
import { Deta } from "deta";

export const deta = Deta(env.DETA_PROJECT_KEY);
