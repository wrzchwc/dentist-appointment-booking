import { Sequelize } from 'sequelize';
import { config } from 'dotenv';

config();

const postgres = new Sequelize(process.env.POSTGRES_URI || '', { logging: false });

/**
 * Connects with database.
 * @throws Error
 */
export async function postgresConnect() {
    try {
        await postgres.authenticate();
        console.log('Database connection established successfully');
    } catch (error) {
        throw new Error('Database connection failed');
    }
}

/**
 * Disconnects with database.
 * @throws Error
 */
export async function postgresDisconnect() {
    try {
        await postgres.close();
        console.log('Database connection closed successfully');
    } catch (error) {
        throw new Error('Database disconnection failed');
    }
}
