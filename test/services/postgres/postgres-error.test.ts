import { PostgresFailureMessage, checkConnection, disconnect, restore } from '../../../src/services/postgres/postgres';

jest.mock('sequelize', () => {
    return {
        Sequelize: jest.fn().mockImplementation(() => {
            return {
                authenticate() {
                    return Promise.reject();
                },
                close() {
                    return Promise.reject();
                },
            };
        }),
    };
});

describe('Postgres service errors', () => {
    afterAll(() => {
        restore();
    });

    test('Should throw an error on unsuccessful connection', async () => {
        await expect(checkConnection()).rejects.toThrowError(PostgresFailureMessage.CONNECTION);
    });

    test('Should throw an error on unsuccessful disconnection', async () => {
        await expect(disconnect()).rejects.toThrowError(PostgresFailureMessage.DISCONNECTION);
    });
});
