/* eslint no-console: 0*/
import { checkConnection, disconnect, synchroniseModels } from './services';
import { app } from './config';
import { config } from 'dotenv';
import fs from 'fs';
import https from 'https';

config();

const key = fs.readFileSync('certs/key.pem');
const cert = fs.readFileSync('certs/cert.pem');

const server = https.createServer({ key, cert }, app);

(async function startServer() {
    try {
        await checkConnection();
        await synchroniseModels();
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
