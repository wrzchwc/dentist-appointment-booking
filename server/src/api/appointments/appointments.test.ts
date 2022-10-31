import { AppointmentQuestion, User } from '../../models';
import { checkConnection, createCookie, createCookieHeader, createSignature, disconnect } from '../../services';
import { Response } from 'superagent';
import { app } from '../../config';
import supertest from 'supertest';

describe('/api/appointments', () => {
    let id: string;
    let cookie: string;
    let signature: string;
    let cookieHeader: [string];

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

    describe('GET /services', () => {
        let response: Response;

        test('Should return 200', async () => {
            response = await supertest(app).get('/api/appointments/services').set('Cookie', cookieHeader).expect(200);
        });

        test('should return array of objects', () => {
            expect(Array.isArray(response.body)).toBeTruthy();
        });
    });

    describe('GET /questions', () => {
        let response: Response;

        test('Should return 200', async () => {
            response = await supertest(app).get('/api/appointments/questions').set('Cookie', cookieHeader).expect(200);
        });

        test('should return array of objects', () => {
            expect(Array.isArray(response.body)).toBeTruthy();
        });

        test('should return questions including facts associated with them', () => {
            expect(
                response.body.every(
                    ({ AppointmentFact }: AppointmentQuestion) => AppointmentFact?.id && AppointmentFact.value
                )
            ).toBe(true);
        });
    });
});
