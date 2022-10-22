import { checkConnection, createCookie, createCookieHeader, createSignature, disconnect } from '../../services';
import { User } from '../../models';
import { app } from '../../config';
import supertest from 'supertest';

const name = 'Kuba';
const surname = 'Wierzchowiec';
const email = 'test123@gmail.com';
const photoUrl = 'www.image.com/123';
const googleId = '381902381093';

describe('/api/users', () => {
    beforeAll(async () => {
        await checkConnection();
    });

    afterAll(async () => {
        await disconnect();
    });

    describe('GET /me', () => {
        test('Should return 200 if user exists', async () => {
            const { id } = (await User.create({ name, surname, photoUrl, googleId, email })).toJSON();
            const cookie = createCookie(id);
            const signature = createSignature(cookie, 'session');

            const response = await supertest(app)
                .get('/api/users/me')
                .set('Cookie', createCookieHeader('session', cookie, signature))
                .expect(200);
            expect(response.body).toMatchObject({ email, id, isAdmin: false, name, photoUrl, surname });

            await User.destroy({ where: { id } });
        });

        test('Should return 404 if user does not exist', async () => {
            const cookie = createCookie('f2670877-efb2-4534-a970-807b082e463d');
            const signature = createSignature(cookie, 'session');

            await supertest(app)
                .get('/api/users/me')
                .set('Cookie', createCookieHeader('session', cookie, signature))
                .expect(404);
        });
    });
});
