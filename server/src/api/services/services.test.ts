import { checkConnection, createCookie, createCookieHeader, createSignature, disconnect } from '../../services';
import { Response } from 'superagent';
import { User } from '../../models';
import { app } from '../../config';
import supertest from 'supertest';

describe('/api/services', () => {
    let id: string;
    let cookie: string;
    let signature: string;
    let cookieHeader: [string];
    let response: Response;

    beforeEach(async () => {
        await checkConnection();
        id = (await User.create({ googleId: '381902381093' })).toJSON().id;
        cookie = createCookie(id);
        signature = createSignature(cookie, 'session');
        cookieHeader = createCookieHeader('session', cookie, signature);
    });

    afterEach(async () => {
        await User.destroy({ where: { id } });
    });

    afterAll(async () => {
        await disconnect();
    });

    describe('/ GET', () => {
        it('should return 200', async () => {
            response = await supertest(app).get('/api/appointments/services').set('Cookie', cookieHeader).expect(200);
        });

        it('should return array of objects', () => {
            expect(Array.isArray(response.body)).toBeTruthy();
        });
    });
});
