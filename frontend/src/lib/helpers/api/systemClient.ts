import type { TFetcher } from "$lib/types/fetcher";
import type { ISystemDoc } from "$lib/types/ISystemDoc";
import { VERSION } from "$lib/utils/version";

export async function clientGetSysDoc(fetcher: TFetcher): Promise<ISystemDoc> {
    const url = new URL(`/api/v${VERSION.major}/sysdoc`, window.location.origin);

    const res = await fetcher(url, {
        method: "GET",
        headers: {
            "Accept": "application/json",
        }
    });
    if (!res.ok) throw res; // TODO: Err handling like rust || 4040 THROW FATAL
    const data = await res.json();
    return data;
}