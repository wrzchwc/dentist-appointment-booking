import { SessionData, app } from '../../../config';
import { checkConnection, disconnect } from '../../../services';
import { User } from '../../../models';
import { config } from 'dotenv';
import keygrip from 'keygrip';
import supertest from 'supertest';

config();

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const keys = [process.env.COOKIE_KEY_1!, process.env.COOKIE_KEY_2!, process.env.COOKIE_KEY_3!];

const name = 'Kuba';
const surname = 'Wierzchowiec';
const email = 'test123@gmail.com';
const photoUrl = 'www.image.com/123';
const googleId = '381902381093';

interface Session {
    passport: { user: SessionData };
}

function createCookieHeader(sessionIdentifier: string, cookie: string, signature: string): [string] {
    return [`${sessionIdentifier}=${cookie}; ${sessionIdentifier}.sig=${signature}`];
}

function createSignature(keys: string[], cookie: string, sessionIdentifier: string) {
    return keygrip(keys).sign(`${sessionIdentifier}=${cookie}`);
}

function createCookie(session: Session): string {
    return Buffer.from(JSON.stringify(session)).toString('base64');
}

function createSession(id: string): Session {
    return { passport: { user: { id, isAdmin: false } } };
}

describe('/v1/users', () => {
    beforeAll(() => {
        checkConnection();
    });

    afterAll(() => {
        disconnect();
    });

    describe('GET /me', () => {
        test('Should return 200 if user exists', async () => {
            const { id } = (await User.create({ name, surname, photoUrl, googleId, email })).toJSON();
            const cookie = createCookie(createSession(id));
            const signature = createSignature(keys, cookie, 'session');

            const response = await supertest(app)
                .get('/v1/users/me')
                .set('Cookie', createCookieHeader('session', cookie, signature))
                .expect(200);
            expect(response.body).toMatchObject({ email, id, isAdmin: false, name, photoUrl, surname });

            await User.destroy({ where: { id } });
        });

        test('Should return 404 if user does not exist', async () => {
            const cookie = createCookie(createSession('f2670877-efb2-4534-a970-807b082e463d'));
            const signature = createSignature(keys, cookie, 'session');

            await supertest(app)
                .get('/v1/users/me')
                .set('Cookie', createCookieHeader('session', cookie, signature))
                .expect(404);
        });
    });
});
