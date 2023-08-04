import type { ZodError } from "zod";

export class NotFound extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, NotFound.prototype)
    }
}

export class Invalid extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, Invalid.prototype)
    }
}

export class InvalidZod extends Invalid {
    zodError: ZodError;
    constructor(message: string, zodError: ZodError) {
        super(message);
        Object.setPrototypeOf(this, InvalidZod.prototype)
        this.zodError = zodError;
    }
}

export class DetaBaseError extends Error {
    err: unknown;
    constructor(message: string, err: unknown) {
        super(message);
        Object.setPrototypeOf(this, DetaBaseError.prototype)
        this.err = err;
    }
}

/**
 * Used to indicate that the system cannot process some action due to
 * the expected state not being given. E.g. missing sysdoc / time frame links.
 */
export class InvalidSystemState extends Error {
    constructor(message: string) {
        super(`FATAL SYSTEM ERROR: ${message}`);
        Object.setPrototypeOf(this, InvalidSystemState.prototype)
    }
}