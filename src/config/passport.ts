import passport from 'passport';
import { config } from 'dotenv';
import { Profile, Strategy } from 'passport-google-oauth20';

config();

const AUTH_OPTIONS = {
    callbackURL: '/v1/auth/google/callback',
    clientID: process.env.OAUTH_CLIENT_ID || '',
    clientSecret: process.env.OAUTH_CLIENT_SECRET || '',
};

const strategy = new Strategy(AUTH_OPTIONS, (accessToken, refreshToken, profile, done) => {
    done(null, profile);
});

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, (user as Profile).id);
});

passport.deserializeUser((id: string, done) => {
    done(null, id);
});

export default {};
