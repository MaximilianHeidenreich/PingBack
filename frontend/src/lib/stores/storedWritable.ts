import { browser } from "$app/environment";
import { get, writable, type Updater } from "svelte/store";

export function storedWritable<T>(key: string, initialData: T) {
    const store = writable(initialData);
    const { subscribe, set } = store;
    
    // Load from browser
    if (browser) {
        if (localStorage.getItem(key) !== null) {
            try { set(JSON.parse(localStorage.getItem(key) as string)) }
            catch (e) {
                console.error(`[storedWritable] Error loading key ${key} from localStorage!`, e);
                alert(`Fatal error: storedWritable ${key} failed to load! Contact developer!`); // TODO: Better error
            }
        }
        else {
            localStorage.setItem(key, JSON.stringify(initialData));
        }
    }

    return {
        set(value: T) {
            if (browser) localStorage.setItem(key, JSON.stringify(value));
            set(value);
        },
        update(updater: Updater<T>) {
            const newValue = updater(get(store));
            this.set(newValue);
        },
        subscribe
    }
}
