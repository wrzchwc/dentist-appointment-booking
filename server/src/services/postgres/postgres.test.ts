import { checkConnection, disconnect, restore, synchroniseModels } from './postgres';

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
                sync() {
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
        await expect(checkConnection()).rejects.toThrowError('Database connection failed');
    });

    test('Should throw an error on unsuccessful disconnection', async () => {
        await expect(disconnect()).rejects.toThrowError('Database disconnection failed');
    });

    test('Should throw an error on unsuccessful models synchronisation', async () => {
        await expect(synchroniseModels()).rejects.toThrowError('Sequelize models synchronisation failed');
    });
});
