import { app } from '../../config';
import supertest from 'supertest';

const redirectTarget = '/';

describe('/v1/auth', () => {
    describe('GET /sign-out', () => {
        test(`Should redirect to ${redirectTarget}`, async () => {
            await supertest(app).get('/v1/auth/sign-out').expect(302).expect('Location', redirectTarget);
        });
    });
});
