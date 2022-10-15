/* eslint no-console: 0*/
import { checkConnection, disconnect, synchroniseModels } from './services';
import app from './config/app';
import environment from './config/environment';
import fs from 'fs';
import https from 'https';

const key = fs.readFileSync('certs/key.pem');
const cert = fs.readFileSync('certs/cert.pem');

const server = https.createServer({ key, cert }, app);

(async function startServer() {
    try {
        await checkConnection();
        await synchroniseModels();
        server.listen(environment.port, () => {
            console.log('Server ready');
            console.log(`Listening on port ${environment.port}`);
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
