import { quintOut } from "svelte/easing";

export const TKN_ICON = Object.freeze({
    SIZE: {
        SM: 18,
        BASE: 24,
        LG: 30
    },
    STROKE: {
        SM: 1.5,
        BASE: 2,
        LG: 2.5
    }
});

export const TKN_TRANSITION = Object.freeze({
    DURATION: 350,
    EASING: quintOut
});
