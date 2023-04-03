import { NotFound } from "$lib/errors/core";
import type { TFetcher } from "$lib/types/fetcher";
import type { ISystemDoc } from "$lib/types/ISystemDoc";
import { VERSION } from "$lib/utils/version";

/**
  * Updates the system document with specified updates.
  *
  * @param fetcher
  * @param updates Partial updates to apply
  * @throws NotFound - Sysdoc not found -> Probably fatal system error
  * @throws Invalid -
  * @throws TODO: Interlan error
  */
export async function client_UpdateSysDoc(
  fetcher: TFetcher,
  updates: Partial<ISystemDoc>
): Promise<{}> {
    const url = new URL(`/api/v${VERSION.major}/sysdoc`, window.location.origin);

    const res = await fetcher(url, {
        method: "PATCH",
        headers: {
            "Accept": "application/json",
        },
        body: JSON.stringify(updates)
    });
    if (!res.ok) {
        if (res.status === 404) throw new NotFound(res.statusText);
        throw res;
    }
    const data = await res.json();
    return data;

}
