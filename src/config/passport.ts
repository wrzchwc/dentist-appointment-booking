import { Profile, Strategy } from 'passport-google-oauth20';
import { User } from '../models';
import environment from './environment';
import passport from 'passport';

const AUTH_OPTIONS = {
    callbackURL: '/v1/auth/google/callback',
    clientID: environment.oauth.clientId,
    clientSecret: environment.oauth.clientSecret,
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

export default {};
