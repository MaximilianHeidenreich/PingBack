import { writable } from "svelte/store";

export const s_activeModals = writable<SvelteComponentConstructor<any, any>[] | []>([]);

export function pushModal(modal: SvelteComponentConstructor<any, any>) {
    s_activeModals.update((modals) => [...modals, modal]);
}

export function popModal() {
    s_activeModals.update((modals) => modals.slice(0, -1));
}