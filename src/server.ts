/* eslint no-console: 0*/
import { readFileSync } from 'fs';
import { createServer } from 'https';
import { config } from 'dotenv';
import app from './app';
import { checkConnection, disconnect } from './services/postgres/postgres';

config();

const key = readFileSync('certs/key.pem');
const cert = readFileSync('certs/cert.pem');

const server = createServer({ key, cert }, app);

(async function startServer() {
    try {
        console.log(await checkConnection());

        server.listen(process.env.PORT, () => {
            console.log('Server ready');
            console.log(`Listening on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.error('Server launch failed');
        console.log((error as Error).message);
    }
    process.on('SIGINT', async () => {
        try {
            console.log(await disconnect());
        } catch (error) {
            console.log((error as Error).message);
        }
        process.exit();
    });
})();
