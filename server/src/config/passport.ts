import { Profile, Strategy } from 'passport-google-oauth20';
import { User } from '../models';
import { config } from 'dotenv';
import passport from 'passport';

config();

const AUTH_OPTIONS = {
    callbackURL: '/api/auth/google/callback',
    clientID: process.env.OAUTH_CLIENT_ID || '',
    clientSecret: process.env.OAUTH_CLIENT_SECRET || '',
};

export interface SessionData {
    id: string;
    isAdmin: boolean;
}

const strategy = new Strategy(AUTH_OPTIONS, (accessToken, refreshToken, profile, done) => {
    done(null, profile);
});

passport.use(strategy);

passport.serializeUser(async (user, done) => {
    const [registeredUser] = await User.register(user as Profile);
    const { id, isAdmin } = registeredUser.toJSON();
    const data: SessionData = { id, isAdmin };
    done(null, data);
});

passport.deserializeUser((data: SessionData, done) => {
    done(null, data);
});
