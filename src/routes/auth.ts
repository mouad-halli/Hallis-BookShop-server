import { Router } from 'express';
import { googleAuth, login, register } from '../controllers/auth';
import passport from 'passport'
import '../Passport'
import { validateBody } from '../controllers/validation';
import { validateSignIn, validateSignUp } from '../validator';

const router  = Router()

router.get('/google', passport.authenticate('google',{ scope: ['profile', 'email'] }))

router.get('/google/callback', passport.authenticate('google', {session: false}), googleAuth)

router.get('/logout', (req, res, next) => {
    res.clearCookie('accessToken').status(201).json('logout successfull')
})

router.post('/register', validateBody(validateSignUp), register)

router.post('/login', validateBody(validateSignIn), login)

export default router