import { Router } from 'express';
import passport from 'passport';

const STRATEGY = 'google';
const CALLBACK_OPTIONS = { failureRedirect: '/sign-in-fail', successRedirect: 'http://localhost:4200', session: true };
const authGoogleRouter = Router();

authGoogleRouter.get('/', passport.authenticate(STRATEGY, { scope: ['profile', 'email'] }));
authGoogleRouter.get('/callback', passport.authenticate(STRATEGY, CALLBACK_OPTIONS));

export default authGoogleRouter;
