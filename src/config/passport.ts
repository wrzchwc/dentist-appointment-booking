import { Profile, Strategy } from 'passport-google-oauth20';
import { User } from '../models';
import { config } from 'dotenv';
import passport from 'passport';

config();

const AUTH_OPTIONS = {
    callbackURL: '/v1/auth/google/callback',
    clientID: process.env.OAUTH_CLIENT_ID || '',
    clientSecret: process.env.OAUTH_CLIENT_SECRET || '',
};

interface SessionData {
    googleId: string;
    isAdmin: boolean;
}

const strategy = new Strategy(AUTH_OPTIONS, (accessToken, refreshToken, profile, done) => {
    done(null, profile);
});

passport.use(strategy);

passport.serializeUser(async (user, done) => {
    const [registeredUser] = await User.register(user as Profile);
    const { googleId, isAdmin } = registeredUser.toJSON();
    const data: SessionData = { googleId, isAdmin };
    done(null, data);
});

passport.deserializeUser((data: SessionData, done) => {
    done(null, data);
});
