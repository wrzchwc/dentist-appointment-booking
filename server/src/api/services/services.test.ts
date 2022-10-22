import { checkConnection, createCookie, createCookieHeader, createSignature, disconnect } from '../../services';
import { User } from '../../models';
import { app } from '../../config';
import supertest from 'supertest';

let id: string;
let cookie: string;
let signature: string;
let cookieHeader: [string];

describe('/api/services', () => {
    beforeAll(async () => {
        await checkConnection();
        id = (await User.create({ googleId: '381902381093' })).toJSON().id;
        cookie = createCookie(id);
        signature = createSignature(cookie, 'session');
        cookieHeader = createCookieHeader('session', cookie, signature);
    });

    afterAll(async () => {
        await User.destroy({ where: { id } });
        await disconnect();
    });

    describe('GET /', () => {
        test('Should return 200', async () => {
            const { body } = await supertest(app).get('/api/services').set('Cookie', cookieHeader).expect(200);
            expect(Array.isArray(body)).toBeTruthy();
        });
    });
});
