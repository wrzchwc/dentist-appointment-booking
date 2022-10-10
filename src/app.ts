import express from 'express';
import helmet from 'helmet';
import cookieSession from 'cookie-session';
import { config } from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

config();

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const keys = [process.env.COOKIE_KEY_1!, process.env.COOKIE_KEY_2!, process.env.COOKIE_KEY_3!];
const app = express();

app.use(cors({ origin: process.env.ORIGIN }));
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());
app.use(cookieSession({ name: 'session', maxAge: 86400000, keys }));

export default app;
