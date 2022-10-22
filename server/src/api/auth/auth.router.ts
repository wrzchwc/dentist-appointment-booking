import { Router } from 'express';
import passport from 'passport';
import { signOut } from './auth.controller';

const CALLBACK_OPTIONS = { failureRedirect: '/sign-in-fail', successRedirect: '/', session: true };
const SCOPE = ['profile', 'email'];

export const router = Router();

router.get('/google', passport.authenticate('google', { scope: SCOPE }));
router.get('/google/callback', passport.authenticate('google', CALLBACK_OPTIONS));
router.get('/sign-out', signOut);
