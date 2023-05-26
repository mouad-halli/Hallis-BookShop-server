"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateBook = exports.validatecreateBook = exports.validateUpdateAddress = exports.validateCreateAddress = exports.validateUpdateUser = exports.validateSignIn = exports.validateSignUp = void 0;
var joi_1 = __importDefault(require("joi"));
var Book_1 = require("./models/Book");
var validator = function (validationSchema, validationOptions) { return function (payload) {
    return validationSchema.validate(payload, validationOptions);
}; };
var signUpSchema = joi_1.default.object({
    username: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(3).max(12).alphanum().required(),
    passwordConfirmation: joi_1.default.ref('password')
});
var signInSchema = joi_1.default.object({
    username: joi_1.default.string().required(),
    password: joi_1.default.string().alphanum().required(),
});
var updateUserSchema = joi_1.default.object({
    firstname: joi_1.default.string(),
    lastname: joi_1.default.string(),
    username: joi_1.default.string(),
    email: joi_1.default.string(),
    password: joi_1.default.string(),
    phone: joi_1.default.string().regex(/^[0-9]{10,15}$/).messages({ 'string.pattern.base': "Phone number must be between 10 and 15 digits." }).required()
});
var createAddressSchema = joi_1.default.object({
    street1: joi_1.default.string().required(),
    street2: joi_1.default.string().required(),
    country: joi_1.default.string().required(),
    city: joi_1.default.string().required(),
    zipCode: joi_1.default.string().regex(/^\d{5}(-\d{4})?$/).messages({ 'string.pattern.base': "invalid Zip Code." }).required()
});
var updateAddressSchema = joi_1.default.object({
    street1: joi_1.default.string(),
    street2: joi_1.default.string(),
    country: joi_1.default.string(),
    city: joi_1.default.string(),
    zipCode: joi_1.default.string().regex(/^\d{5}(-\d{4})?$/).messages({ 'string.pattern.base': "invalid Zip Code." })
});
var createBookSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    genre: (_a = joi_1.default.string()).valid.apply(_a, Object.values(Book_1.bookGenres)).required(),
    author: joi_1.default.string().required(),
    year: joi_1.default.number().integer().positive().max(new Date().getFullYear()).required(),
    bookLanguage: (_b = joi_1.default.string()).valid.apply(_b, Object.values(Book_1.bookLanguage)).required(),
    price: joi_1.default.number().positive().required(),
    stockCount: joi_1.default.number().integer().positive().required(),
    description: joi_1.default.string(),
});
var updateBookSchema = joi_1.default.object({
    name: joi_1.default.string(),
    genre: (_c = joi_1.default.string()).valid.apply(_c, Object.values(Book_1.bookGenres)),
    author: joi_1.default.string(),
    year: joi_1.default.number().integer().positive().max(new Date().getFullYear()),
    bookLanguage: (_d = joi_1.default.string()).valid.apply(_d, Object.values(Book_1.bookLanguage)),
    price: joi_1.default.number().positive(),
    stockCount: joi_1.default.number().integer().positive(),
    description: joi_1.default.string(),
});
exports.validateSignUp = validator(signUpSchema, { abortEarly: true });
exports.validateSignIn = validator(signInSchema, { abortEarly: true });
exports.validateUpdateUser = validator(updateUserSchema, { abortEarly: true });
exports.validateCreateAddress = validator(createAddressSchema, { abortEarly: true });
exports.validateUpdateAddress = validator(updateAddressSchema, { abortEarly: true });
exports.validatecreateBook = validator(createBookSchema, { abortEarly: true });
exports.validateUpdateBook = validator(updateBookSchema, { abortEarly: true });
