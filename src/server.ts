import { readFileSync } from 'fs';
import { createServer } from 'https';
import { config } from 'dotenv';
import app from './app';
import { postgresConnect } from './services/postgres';

config();

const key = readFileSync('key.pem');
const cert = readFileSync('cert.pem');

const server = createServer({ key, cert }, app);

(async function startServer() {
    try {
        await postgresConnect();
        server.listen(process.env.PORT, () => {
            console.log('Server ready');
            console.log(`Listening on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.error('Server launch failed');
        console.log((error as Error).message);
    }
})();
