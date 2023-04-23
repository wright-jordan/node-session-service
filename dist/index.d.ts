/// <reference types="node" />
import http from "node:http";
import { SomeErrors } from "some-errors";
export type Data = {
    absoluteDeadline: number;
    idleDeadline: number;
    renewalDeadline: number;
    isRetired: boolean;
    loginID: string;
    id: string;
};
export type Session<D extends Data> = {
    id: string;
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
     *
     * If `err` is not null, then the operation failed.
     */
    set(sess: Session<D>, isRegenerable: boolean): Promise<{
        cookie: string;
        err: SessionError | null;
    }>;
};
