"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var passport_google_oauth2_1 = require("passport-google-oauth2");
var passport_1 = __importDefault(require("passport"));
var envConfig_1 = require("./config/envConfig");
passport_1.default.use(new passport_google_oauth2_1.Strategy({
    clientID: envConfig_1.GOOGLE_CLIENT_ID,
    clientSecret: envConfig_1.GOOGLE_CLIENT_SECRET,
    callbackURL: "".concat(envConfig_1.SERVER_URL, "/auth/google/callback"),
    passReqToCallback: true
}, function (request, accessToken, refreshToken, profile, done) {
    var id = profile.id, name = profile.name, picture = profile.picture, email = profile.email;
    var fullPicture = picture.substring(0, picture.indexOf("=s"));
    done(null, { id: id, name: name, fullPicture: fullPicture, email: email });
}));
passport_1.default.serializeUser(function (user, done) {
    done(null, user);
});
passport_1.default.deserializeUser(function (user, done) {
    done(null, user);
});
