import { browser } from "$app/environment";
import { get, writable, type Updater } from "svelte/store";

/**
 * Svelte writable store connected to localStorage API for persiatance.
 * @param data
 * @param localStoreKey
 * @returns
 */
export function localStorable<T>(data: T, localStoreKey: string) {
   const store = writable<T>(data);
   const { subscribe, set, update } = store;

   browser &&
      localStorage.getItem(localStoreKey) &&
      set(JSON.parse(localStorage.getItem(localStoreKey)!));

   return {
      subscribe,
      set: (d: T) => {
         browser && (localStorage.setItem(localStoreKey, JSON.stringify(d)));
         set(d);
      },
      update: (updater: Updater<T>) => {
        update(updater);
         const updatedStore = get(store);

         browser && (localStorage.setItem(localStoreKey, JSON.stringify(updatedStore)));
         set(updatedStore);
      }
   };
}