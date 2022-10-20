import './passport';
import { config } from 'dotenv';
import cookieSession from 'cookie-session';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { join } from 'path';
import morgan from 'morgan';
import passport from 'passport';
import { v1 } from '../api';

config();

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const keys = [process.env.COOKIE_KEY_1!, process.env.COOKIE_KEY_2!, process.env.COOKIE_KEY_3!];
export const app = express();

app.use(cors({ credentials: true }));
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.static(join(__dirname, '..', '..', '..', 'public')));
app.use(cookieSession({ name: 'session', maxAge: 86400000, keys, domain: 'localhost' }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/v1', v1.api);
app.get('/*', (req, res) => {
    res.sendFile(join(__dirname, '..', '..', '..', 'public', 'index.html'));
});
