"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuth = exports.login = exports.register = void 0;
var http_status_codes_1 = require("http-status-codes");
var User_1 = __importDefault(require("../models/User"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var errors_1 = require("../utils/errors");
var envConfig_1 = require("../config/envConfig");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("../validator");
var OK = http_status_codes_1.StatusCodes.OK, CREATED = http_status_codes_1.StatusCodes.CREATED, BAD_REQUEST = http_status_codes_1.StatusCodes.BAD_REQUEST, PERMANENT_REDIRECT = http_status_codes_1.StatusCodes.PERMANENT_REDIRECT;
var register = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var newUser, duplicateUser, salt, hash, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                newUser = new User_1.default({
                    username: req.body.username,
                    email: req.body.email
                });
                return [4 /*yield*/, User_1.default.findOne({
                        $or: [{ username: newUser.username }, { email: newUser.email }]
                    })];
            case 1:
                duplicateUser = _a.sent();
                if (duplicateUser) {
                    if (duplicateUser.username === newUser.username)
                        return [2 /*return*/, next((0, errors_1.createError)(BAD_REQUEST, "this username is already in use"))];
                    if (duplicateUser.email === newUser.email)
                        return [2 /*return*/, next((0, errors_1.createError)(BAD_REQUEST, "this email is already in use"))];
                }
                if (req.body.password !== req.body.passwordConfirmation)
                    return [2 /*return*/, next((0, errors_1.createError)(BAD_REQUEST, "password and confirm password must be identical"))];
                return [4 /*yield*/, bcryptjs_1.default.genSalt(10)];
            case 2:
                salt = _a.sent();
                return [4 /*yield*/, bcryptjs_1.default.hash(req.body.password, salt)];
            case 3:
                hash = _a.sent();
                newUser.password = hash;
                return [4 /*yield*/, newUser.save()];
            case 4:
                _a.sent();
                res.status(CREATED).json("User registered succesfully");
                return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                next(error_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.register = register;
var login = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, isPasswordCorrect, payload, token, _a, username, email, imgPath, isAdmin, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                return [4 /*yield*/, User_1.default.findOne({ username: req.body.username }).select("+password")];
            case 1:
                user = _b.sent();
                if (!user || !user.password)
                    return [2 /*return*/, next((0, errors_1.createError)(BAD_REQUEST, "Wrong password or username"))];
                return [4 /*yield*/, bcryptjs_1.default.compare(req.body.password, user.password)];
            case 2:
                isPasswordCorrect = _b.sent();
                if (!isPasswordCorrect)
                    return [2 /*return*/, next((0, errors_1.createError)(BAD_REQUEST, "Wrong password or username"))];
                payload = {
                    id: user.id,
                    isAdmin: user.isAdmin
                };
                token = jsonwebtoken_1.default.sign(payload, envConfig_1.JWT_SECRET, { expiresIn: envConfig_1.JWT_EXPIRATION_H });
                _a = user._doc, username = _a.username, email = _a.email, imgPath = _a.imgPath, isAdmin = _a.isAdmin;
                res.status(OK)
                    .cookie('accessToken', token, { httpOnly: true })
                    .json({ username: username, email: email, imgPath: imgPath, isAdmin: isAdmin, token: token });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                next(error_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
var googleAuth = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, payload, token, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, User_1.default.findOne({ googleId: req.user.id })];
            case 1:
                user = _a.sent();
                if (!!user) return [3 /*break*/, 3];
                user = new User_1.default({
                    googleId: req.user.id,
                    firstname: req.user.name.familyName,
                    lastname: req.user.name.givenName,
                    contactInfo: { email: req.user.email },
                    imgPath: req.user.fullPicture,
                });
                return [4 /*yield*/, user.save()];
            case 2:
                user = _a.sent();
                _a.label = 3;
            case 3:
                payload = {
                    id: user._id,
                };
                token = jsonwebtoken_1.default.sign(payload, envConfig_1.JWT_SECRET, { expiresIn: envConfig_1.JWT_EXPIRATION_H });
                res.status(OK)
                    .cookie('accessToken', token, { httpOnly: true })
                    .redirect(PERMANENT_REDIRECT, envConfig_1.CLIENT_URL);
                return [3 /*break*/, 5];
            case 4:
                error_3 = _a.sent();
                next(error_3);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.googleAuth = googleAuth;
