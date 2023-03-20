import type { SvelteComponent, SvelteComponentTyped } from "svelte";
import { writable } from "svelte/store";

export const s_activeModals = writable<[SvelteComponentConstructor<any, any>, object][] | []>([]);

export function pushModal(modal: SvelteComponentConstructor<any, any>, props?: object) {
    let p = props || {};
    s_activeModals.update((modals) => [...modals, [modal, p]]);
}

export function popModal() {
    s_activeModals.update((modals) => modals.slice(0, -1));
}