import { storedWritable } from "./storedWritable";

export const s_darkMode = storedWritable<boolean>("pb_darkMode", false);

// TODO: Add browser default: https://dev.to/willkre/persistent-theme-switch-dark-mode-with-svelte-sveltekit-tailwind-1b9g
