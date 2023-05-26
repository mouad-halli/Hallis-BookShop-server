"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_1 = require("../controllers/auth");
var passport_1 = __importDefault(require("passport"));
require("../Passport");
var validation_1 = require("../controllers/validation");
var validator_1 = require("../validator");
var router = (0, express_1.Router)();
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport_1.default.authenticate('google', { session: false }), auth_1.googleAuth);
router.get('/logout', function (req, res, next) {
    res.clearCookie('accessToken').status(201).json('logout successfull');
});
router.post('/register', (0, validation_1.validateBody)(validator_1.validateSignUp), auth_1.register);
router.post('/login', (0, validation_1.validateBody)(validator_1.validateSignIn), auth_1.login);
exports.default = router;
