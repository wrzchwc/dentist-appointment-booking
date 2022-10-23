import { app } from '../../config';
import supertest from 'supertest';

describe('/api/auth', () => {
    describe('GET /sign-out', () => {
        test(`Should redirect to /`, async () => {
            await supertest(app).get('/api/auth/sign-out').expect(302).expect('Location', '/');
        });
    });
});
