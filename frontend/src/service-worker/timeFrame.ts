import { NotFound } from "$lib/errors/core";
import type { ITimeFrame } from "$lib/types/ITimeFrame";
import type { IWorkerInitialization } from ".";

export async function sw_GetTimeFrame(
    ctx: IWorkerInitialization,
    frameEnd: number
): Promise<ITimeFrame |  null> { // TODO: Can return null?
    console.debug(`[SW TimeFrame] Getting frame ${frameEnd}`);
    
    const url = new URL(`/api/v${ctx.VERSION!.major}/timeframes/${frameEnd}`, ctx.ORIGIN!);
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json",
        }
    });
    if (!res.ok) {
        if (res.status === 404) throw new NotFound(res.statusText);
        else throw res; // TODO: Err handling like rust
    }
    const data = await res.json();

    return data as ITimeFrame;
}
