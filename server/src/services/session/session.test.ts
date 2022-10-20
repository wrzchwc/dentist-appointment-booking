import { Session, createCookie, createCookieHeader, createSession, createSignature } from './session';

describe('Session service', () => {
    test('createSession should create objects matching Session interface', () => {
        const expected: Session = { passport: { user: { id: 'abc', isAdmin: false } } };

        const result = createSession('abc');

        expect(result).toMatchObject(expected);
    });

    test('createCookie should return strings encoded in base64', () => {
        const expected = 'eyJwYXNzcG9ydCI6eyJ1c2VyIjp7ImlkIjoiYWJjIiwiaXNBZG1pbiI6ZmFsc2V9fX0=';

        const result = createCookie(createSession('abc'));

        expect(result).toBe(expected);
    });

    test('createSignature should cipher sessions', () => {
        const cookie = 'eyJwYXNzcG9ydCI6eyJ1c2VyIjp7ImlkIjoiYWJjIiwiaXNBZG1pbiI6ZmFsc2V9fX0=';
        const expected = 'J5vC7BDDmj4mBqOkd9jgm0_sFUE';

        const result = createSignature(cookie, 'session');

        expect(result).toBe(expected);
    });

    test('createCookieHeader should return correct header', () => {
        const sessionIdentifier = 'session';
        const cookie = 'eyJwYXNzcG9ydCI6eyJ1c2VyIjp7ImlkIjoiYWJjIiwiaXNBZG1pbiI6ZmFsc2V9fX0=';
        const signature = 'J5vC7BDDmj4mBqOkd9jgm0_sFUE';
        const expected = [
            'session=eyJwYXNzcG9ydCI6eyJ1c2VyIjp7ImlkIjoiYWJjIiwiaXNBZG1pbiI6ZmFsc2V9fX0=; session.sig=J5vC7BDDmj4mBqOkd9jgm0_sFUE',
        ];

        const result = createCookieHeader(sessionIdentifier, cookie, signature);

        expect(result).toStrictEqual(expected);
    });
});
