import { browser } from "$app/environment";
import { generatePalette } from "emoji-palette";

export function client_GetEventIconColor(icon: string): string {
    if (!browser) return "#ffffff";
    const iconPalette = generatePalette(icon);
    return `${iconPalette[0]}22`;

}
