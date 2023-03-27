import { localStorable } from "./localStorable";

export const s_darkMode = localStorable<boolean>(false, "pb_darkMode");

// TODO: Add browser default: https://dev.to/willkre/persistent-theme-switch-dark-mode-with-svelte-sveltekit-tailwind-1b9g