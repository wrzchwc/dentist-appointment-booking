import { Sequelize } from 'sequelize';
import { config } from 'dotenv';

config();

const URI = process.env.POSTGRES_URI || '';
const OPTIONS = { logging: false };

export enum PostgresSuccessMessage {
    CONNECTED = 'Database connection established successfully',
    DISCONNECTED = 'Database connection closed successfully',
}

export enum PostgresFailureMessage {
    CONNECTION = 'Database connection failed',
    DISCONNECTION = 'Database disconnection failed',
}

let postgres = new Sequelize(URI, OPTIONS);

/**
 * Connects with database.
 * @throws Error
 */
export async function checkConnection() {
    try {
        await postgres.authenticate();
        return PostgresSuccessMessage.CONNECTED;
    } catch (error) {
        throw new Error(PostgresFailureMessage.CONNECTION);
    }
}

/**
 * Disconnects with database.
 * @throws Error
 */
export async function disconnect() {
    try {
        await postgres.close();
        return PostgresSuccessMessage.DISCONNECTED;
    } catch (error) {
        throw new Error(PostgresFailureMessage.DISCONNECTION);
    }
}

export function restore() {
    postgres = new Sequelize(URI, OPTIONS);
}
