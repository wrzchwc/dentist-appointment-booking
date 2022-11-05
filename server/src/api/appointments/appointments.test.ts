import { Appointment, AppointmentQuestion, User } from '../../models';
import { checkConnection, createCookie, createCookieHeader, createSignature, disconnect } from '../../services';
import { Response } from 'superagent';
import { app } from '../../config';
import supertest from 'supertest';

describe('/api/appointments', () => {
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

    describe('/services GET', () => {
        it('should return 200', async () => {
            response = await supertest(app).get('/api/appointments/services').set('Cookie', cookieHeader).expect(200);
        });

        it('should return array of objects', () => {
            expect(Array.isArray(response.body)).toBeTruthy();
        });
    });

    describe('/questions GET', () => {
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

    describe('/ POST', () => {
        beforeEach(async () => {
            response = await supertest(app).post('/api/appointments').set('Cookie', cookieHeader);
        });

        afterEach(async () => {
            await Appointment.destroy({ where: { id: response.body.id } });
        });

        it('should return 201 on successful creation', () => {
            expect(response.status).toBe(201);
        });

        it('should return correct body response', () => {
            const expected: Partial<Appointment> = {
                id: response.body.id,
                confirmed: false,
                estimatedPrice: null,
                startsAt: null,
                services: [],
                factors: [],
            };

            expect(response.body).toMatchObject(expected);
        });
    });
});
