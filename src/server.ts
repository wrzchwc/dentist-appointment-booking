import { readFileSync } from 'fs';
import { createServer } from 'https';
import { config } from 'dotenv';
import app from './app';

config();

const key = readFileSync('key.pem');
const cert = readFileSync('cert.pem');

const server = createServer({ key, cert }, app);

server.listen(process.env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log('Server ready');
    // eslint-disable-next-line no-console
    console.log(`Listening on port ${process.env.PORT}`);
});
