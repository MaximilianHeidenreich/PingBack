import type { PushSubscription } from "web-push";

/**
 * A push subscription from a client app.
 */
export interface IPushSubscription {
    key: string;    // Client associated with this subscription
    subscription: PushSubscription;
}
