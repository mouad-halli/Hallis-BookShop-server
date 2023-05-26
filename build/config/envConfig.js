"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GOOGLE_CLIENT_SECRET = exports.GOOGLE_CLIENT_ID = exports.STRIPE_WEBHOOK_ENDPOINT_SECRET = exports.STRIPE_SECRET_KEY = exports.SERVER_URL = exports.UPLOAD_LOCATION = exports.CLIENT_URL = exports.CLIENT_PORT = exports.CLIENT_NAME = exports.JWT_EXPIRATION_D = exports.JWT_EXPIRATION_H = exports.JWT_SECRET = exports.DB_LINK = exports.PORT = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var PORT = Number(process.env.PORT || 8000);
exports.PORT = PORT;
var DB_LINK = String(process.env.DB_LINK);
exports.DB_LINK = DB_LINK;
var JWT_SECRET = String(process.env.JWT_SECRET);
exports.JWT_SECRET = JWT_SECRET;
var JWT_EXPIRATION_H = String(process.env.JWT_EXPIRATION_H);
exports.JWT_EXPIRATION_H = JWT_EXPIRATION_H;
var JWT_EXPIRATION_D = String(process.env.JWT_EXPIRATION_D);
exports.JWT_EXPIRATION_D = JWT_EXPIRATION_D;
// Front end
var CLIENT_NAME = String(process.env.FRONT_END_NAME);
exports.CLIENT_NAME = CLIENT_NAME;
var CLIENT_PORT = String(process.env.FRONT_END_PORT);
exports.CLIENT_PORT = CLIENT_PORT;
// const CLIENT_URL: string = `http://${CLIENT_NAME}:${CLIENT_PORT}`
var CLIENT_URL = String(process.env.FRONT_END_URL);
exports.CLIENT_URL = CLIENT_URL;
// Back end
var SERVER_URL = String(process.env.BACK_END_URL);
exports.SERVER_URL = SERVER_URL;
var UPLOAD_LOCATION = String(process.env.UPLOAD_LOCATION);
exports.UPLOAD_LOCATION = UPLOAD_LOCATION;
//STRIPE
var STRIPE_SECRET_KEY = String(process.env.STRIPE_SECRET_KEY);
exports.STRIPE_SECRET_KEY = STRIPE_SECRET_KEY;
var STRIPE_WEBHOOK_ENDPOINT_SECRET = String(process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET);
exports.STRIPE_WEBHOOK_ENDPOINT_SECRET = STRIPE_WEBHOOK_ENDPOINT_SECRET;
//GOOGLE
var GOOGLE_CLIENT_ID = String(process.env.GOOGLE_CLIENT_ID);
exports.GOOGLE_CLIENT_ID = GOOGLE_CLIENT_ID;
var GOOGLE_CLIENT_SECRET = String(process.env.GOOGLE_CLIENT_SECRET);
exports.GOOGLE_CLIENT_SECRET = GOOGLE_CLIENT_SECRET;
