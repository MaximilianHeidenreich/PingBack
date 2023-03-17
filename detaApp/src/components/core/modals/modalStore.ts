import { writable } from "svelte/store";

export const s_activeModals = writable<SvelteComponentConstructor<any, any>[] | []>([]);

export function pushModal(modal: SvelteComponentConstructor<any, any>) {
    modalStore.update((modals) => [...modals, modal]);
}

export function popModal() {
    modalStore.update((modals) => modals.slice(0, -1));
}