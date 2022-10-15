import { Router } from 'express';
import { signOut } from './auth.controller';
import passport from 'passport';

enum AuthStrategy {
    GOOGLE = 'google',
}

const CALLBACK_OPTIONS = { failureRedirect: '/sign-in-fail', successRedirect: 'http://localhost:4200', session: true };
const SCOPE = ['profile', 'email'];

export const router = Router();

router.get('/google', passport.authenticate(AuthStrategy.GOOGLE, { scope: SCOPE }));
router.get('/google/callback', passport.authenticate(AuthStrategy.GOOGLE, CALLBACK_OPTIONS));
router.get('/sign-out', signOut);
