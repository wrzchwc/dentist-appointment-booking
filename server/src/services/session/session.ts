import { SessionData } from '../../config';
import { config } from 'dotenv';
import keygrip from 'keygrip';

config();

export interface Session {
    passport: { user: SessionData };
}

export function createCookieHeader(sessionIdentifier: string, cookie: string, signature: string): [string] {
    return [`${sessionIdentifier}=${cookie}; ${sessionIdentifier}.sig=${signature}`];
}

export function createSignature(cookie: string, sessionIdentifier: string) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const keys = [process.env.COOKIE_KEY_1!, process.env.COOKIE_KEY_2!, process.env.COOKIE_KEY_3!];
    return keygrip(keys).sign(`${sessionIdentifier}=${cookie}`);
}

export function createCookie(session: Session): string {
    return Buffer.from(JSON.stringify(session)).toString('base64');
}

export function createSession(id: string): Session {
    return { passport: { user: { id, isAdmin: false } } };
}
