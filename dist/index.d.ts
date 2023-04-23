/// <reference types="node" />
import http from "node:http";
import { SomeErrors } from "some-errors";
export type Data = {
    /**
     * ID for the individual `Session.Data` object.
     */
    id: string;
    /**
     * The number of ms since the epoch at which the session will be expired, regardless of activity.
     */
    absoluteDeadline: bigint;
    /**
     * The number of ms since the epoch at which the session will be expired if it remains inactive.
     */
    idleDeadline: bigint;
    /**
     * The number of ms since the epoch at which a new associated data object will be created.
     */
    renewalDeadline: bigint;
    /**
     * Indicates whether the data object has been renewed or regenerated.
     */
    isRetired: boolean;
    /**
     * Defaults to an empty string and remains so until an associated data object is created.
     * This can be done with renewal or regeneration.
     */
    groupID: string;
};
export type Session<D extends Data> = {
    sig: string;
    data: D;
    isNew: boolean;
};
export declare class SessionError extends Error {
}
export declare class BadSignatureError extends SessionError {
}
export declare class NotRecoverableError extends SessionError {
}
export type Service<D extends Data> = {
    /**
     * Retrieves and existing session or creates a new one.
     * Newly created sessions are not immediately saved to the store.
     * Will be discarded at the end of the request if `Service.save` is not called.
     *
     * If `err` contains {@link NotRecoverableError},
     * then the operation failed.
     *
     * If `err` contains {@link BadSignatureError},
     * then the signature was incorrect,
     * but a new usable `session` will be generated,
     * unless a {@link NotRecoverableError} also occurred.
     */
    get(req: http.IncomingMessage): Promise<{
        session: Session<D>;
        errs: SomeErrors<SessionError> | null;
    }>;
    /**
     * Will save a session to the configured store.
     * Returns a cookie string that should be set on the response.
     *
     * Will update the id of an old session if `isRegenerable` is true and `sess.isNew` is false.
     * It is generally a good idea to set `isRegenerable` after changes to authorization level (e.g. after login).
     * This will also create a new `sess.data.groupID` if it is occurs before the first renewal.
     *
     * If `err` is not null, then the operation failed.
     */
    set(sess: Session<D>, isRegenerable: boolean): Promise<{
        cookie: string;
        err: SessionError | null;
    }>;
};
