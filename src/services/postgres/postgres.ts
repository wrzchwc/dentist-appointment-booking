import { Sequelize } from 'sequelize';
import { config } from 'dotenv';

config();

const URI = process.env.POSTGRES_URI || '';
const OPTIONS = { logging: false };

export const sequelizeInstance = new Sequelize(URI, OPTIONS);

/**
 * Connects with database.
 * @throws Error
 */
export async function checkConnection() {
    try {
        await sequelizeInstance.authenticate();
    } catch (error) {
        throw new Error('Database connection failed');
    }
}

/**
 * Disconnects with database.
 * @throws Error
 */
export async function disconnect() {
    try {
        await sequelizeInstance.close();
    } catch (error) {
        throw new Error('Database disconnection failed');
    }
}

/**
 * Synchronises models with database
 * @throws Error
 */
export async function synchroniseModels() {
    try {
        await sequelizeInstance.sync({ alter: true });
    } catch (error) {
        throw new Error('Sequelize models synchronisation failed');
    }
}
