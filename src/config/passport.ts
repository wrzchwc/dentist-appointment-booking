import passport from 'passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { User } from '../models';
import environment from './environment';

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
    const googleId = (user as Profile).id;
    const name = (user as Profile).name?.givenName;
    const surname = (user as Profile).name?.familyName;
    const photoUrl = (user as Profile).photos?.at(0)?.value;
    const email = (user as Profile).emails?.find(({ verified }) => verified)?.value;
    const [persistedUser] = await User.findOrCreate({
        where: { googleId },
        defaults: { googleId, name, surname, photoUrl, email },
    });
    const data: SessionData = { googleId, isAdmin: persistedUser.toJSON().isAdmin };
    done(null, data);
});

passport.deserializeUser((data: SessionData, done) => {
    done(null, data);
});

export default {};
