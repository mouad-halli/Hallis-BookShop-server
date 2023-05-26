import { Strategy } from 'passport-google-oauth2'
import passport from 'passport'
import { SERVER_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from './config/envConfig'

passport.use(new Strategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${SERVER_URL}/auth/google/callback`,
        passReqToCallback   : true
    },
    function(request: any, accessToken: any, refreshToken: any, profile: any, done: any) {
        const {id, name, picture, email} = profile
        const fullPicture = picture.substring(0, picture.indexOf("=s"))
        done(null, {id, name, fullPicture, email})
    }
))

passport.serializeUser((user: any, done) => {
    done(null, user)
})

passport.deserializeUser((user: any, done) => {
    done(null, user)
})