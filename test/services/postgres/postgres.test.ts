import { PostgresSuccessMessage, checkConnection, disconnect, restore } from '../../../src/services/postgres/postgres';

describe('Postgres service', () => {
    afterAll(() => {
        restore();
    });

    test('Should return confirm message on successful connection', async () => {
        const result = await checkConnection();
        expect(result).toBe(PostgresSuccessMessage.CONNECTED);
    });

    test('Should return confirm message on successful disconnection', async () => {
        const result = await disconnect();
        expect(result).toBe(PostgresSuccessMessage.DISCONNECTED);
    });
});
