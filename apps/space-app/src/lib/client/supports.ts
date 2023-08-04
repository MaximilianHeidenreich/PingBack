import { browser } from "$app/environment";

export function supports_Notification(): boolean {
    if (!browser) return false;
    return ("Notification" in window);
}
