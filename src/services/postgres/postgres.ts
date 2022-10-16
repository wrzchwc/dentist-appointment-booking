import { Sequelize } from 'sequelize';
import { config } from 'dotenv';

config();

const URI = process.env.POSTGRES_URI || '';
const OPTIONS = { logging: false };

export enum FailureMessage {
    CONNECTION = 'Database connection failed',
    DISCONNECTION = 'Database disconnection failed',
    SYNCHRONISATION = 'Sequelize models synchronisation failed',
}

export let sequelizeInstance = new Sequelize(URI, OPTIONS);

/**
 * Connects with database.
 * @throws Error
 */
export async function checkConnection() {
    try {
        await sequelizeInstance.authenticate();
    } catch (error) {
        throw new Error(FailureMessage.CONNECTION);
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
        throw new Error(FailureMessage.DISCONNECTION);
    }
}

export function restore() {
    sequelizeInstance = new Sequelize(URI, OPTIONS);
}

export async function synchroniseModels() {
    try {
        await sequelizeInstance.sync({ alter: true });
    } catch (error) {
        throw new Error(FailureMessage.SYNCHRONISATION);
    }
}
