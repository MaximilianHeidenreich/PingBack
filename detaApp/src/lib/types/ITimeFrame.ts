import type { OpUnitType } from "dayjs";

/**
 * A time frame is a time range `[frameEnd - TIME_FRAME_OFFSET_SCALAR, frameEnd]` that contains events.
 * It is a linked list, with `nextFrame` and `previousFrame` pointing to the next and previous time frame.
 */
export interface ITimeFrame {
    key: string;    // timestamp of the end of the time frame
    frameEnd: number;   // timestamp of the end of the time frame
    nextFrame: number;  // key of next (future) frame
    previousFrame: number;  // key of previous (past) frame
    eventCount: number; // number of events in this frame
    containsEventsFor: {
        "projects": string[];   // project
        "channels": string[];   // project#channel
    }
}
export const TIME_FRAME_OFFSET_SCALAR: number = 1;
export const TIME_FRAME_OFFSET_UNIT: OpUnitType = "hour";