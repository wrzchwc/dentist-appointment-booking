import passport from 'passport';
import { config } from 'dotenv';
import { Strategy } from 'passport-google-oauth20';

config();

const AUTH_OPTIONS = {
    callbackURL: '/auth/auth-google/callback',
    clientID: process.env.OAUTH_CLIENT_ID || '',
    clientSecret: process.env.OAUTH_CLIENT_SECRET || '',
};

const strategy = new Strategy(AUTH_OPTIONS, (accessToken, refreshToken, profile, done) => {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    console.log(done);
    done(null, profile);
});

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, false);
});

passport.deserializeUser((user, done) => {
    done(null, false);
});

export default {};
