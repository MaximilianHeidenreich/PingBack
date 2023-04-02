import { TIME_FRAME_OFFSET_UNIT } from "$lib/types/ITimeFrame";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

/**
 * Gets the frame end for a given timestamp.
 * @param timestamp
 */
export function getTimeFrameEnd(timestamp: number): Dayjs {
    return dayjs(timestamp).endOf(TIME_FRAME_OFFSET_UNIT);
}