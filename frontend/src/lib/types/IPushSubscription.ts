/**
 * A push subscription from a client app.
 */
export interface IPushSubscription {
    key: string; // Unique id
    endpoint: string;
    expirationTime: number;
    options: {
        userVisibleOnly?: boolean;
        applicationServerKey?: string;
    };
}
