import type { IEvent } from "$lib/types/IEvent";
import { TIME_FRAME_OFFSET_UNIT } from "$lib/types/ITimeFrame";
import dayjs from "dayjs";
import type { IWorkerContext } from ".";

export async function sw_FetchEventsRaw(
  ctx: IWorkerContext,
  query:
    | (Partial<IEvent> & { [key: string]: unknown })
    | (Partial<IEvent> & { [key: string]: unknown })[],
  lastKey?: string,
  limit?: number
): Promise<{ items: IEvent[]; count: number; last?: string }> {
  const url = new URL(`/api/v${ctx.VERSION!.major}/events`, ctx.ORIGIN!);
  url.searchParams.set("query", btoa(JSON.stringify(query)));
  if (lastKey) url.searchParams.set("lastKey", lastKey);
  if (limit) url.searchParams.set("limit", limit.toString());

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  });
  if (!res.ok) throw res; // TODO: Handle
  const data = await res.json();
  return data;
}

export async function sw_FetchAllEvents(
  ctx: IWorkerContext,
  query:
    | (Partial<IEvent> & { [key: string]: unknown })
    | (Partial<IEvent> & { [key: string]: unknown })[]
): Promise<{ items: IEvent[]; count: number }> {
  let lastKey: string | undefined;
  let events: IEvent[] = [];

  // Initial fetch.
  let res: any = await sw_FetchEventsRaw(ctx, query, undefined); // TODO: Fix any type
  events = events.concat(res.items);
  lastKey = res.last;

  while (lastKey) {
    let res: any = await sw_FetchEventsRaw(
      ctx,
      query,
      lastKey === "" ? undefined : lastKey
    ); // TODO: Fix any type
    events = events.concat(res.items);
    lastKey = res.last;
  }
  return { items: events, count: events.length };
}

/**
 * Fetches all events (up to 1MB at a time) inside the given timeframe.
 * @param fetcher
 * @param projectID
 * @param frameEnd
 * @param query
 * @param lastKey
 * @param limit
 * @returns [events fetch result, more events available in some previous frame]
 */
export async function sw_FetchAllEventsInFrame( // TODO: Refactor
  ctx: IWorkerContext,
  frameEnd: number,
  query:
    | (Partial<IEvent> & { [key: string]: unknown })
    | (Partial<IEvent> & { [key: string]: unknown })[]
): Promise<{ items: IEvent[]; count: number }> {
  // TODO: remove [] OR -> Cannot query -> if necessary query after fetch
  frameEnd = dayjs(frameEnd).endOf(TIME_FRAME_OFFSET_UNIT).valueOf(); // Make sure we use the end of hour as frame end
  console.debug(
    `[SW Events] Fetching events for frame ${frameEnd} (${dayjs(
      frameEnd
    ).format()})`
  );

  const res = await sw_FetchAllEvents(ctx, {
    ...query,
    "createdAt?r": [
      dayjs(frameEnd).startOf(TIME_FRAME_OFFSET_UNIT).valueOf(),
      dayjs(frameEnd).endOf(TIME_FRAME_OFFSET_UNIT).valueOf()
    ]
  });
  return res;
}

