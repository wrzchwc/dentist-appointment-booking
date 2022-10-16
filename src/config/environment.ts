/* eslint @typescript-eslint/no-non-null-assertion: 0*/
import { config } from 'dotenv';

config();

interface Environment {
    port: number;
    origin: string;
    cookieKeys: string[];
    postgresURI: string;
    oauth: {
        clientId: string;
        clientSecret: string;
    };
}

const environment: Environment = {
    port: Number(process.env.PORT),
    origin: process.env.ORIGIN!,
    cookieKeys: [process.env.COOKIE_KEY_1!, process.env.COOKIE_KEY_2!, process.env.COOKIE_KEY_3!],
    postgresURI: process.env.POSTGRES_URI!,
    oauth: {
        clientId: process.env.OAUTH_CLIENT_ID!,
        clientSecret: process.env.OAUTH_CLIENT_SECRET!,
    },
};
export default environment;
