"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = void 0;
var errors_1 = require("../utils/errors");
var http_status_codes_1 = __importDefault(require("http-status-codes"));
var BAD_REQUEST = http_status_codes_1.default.BAD_REQUEST;
var validateBody = function (validator) {
    return function (req, res, next) {
        var error = validator(req.body).error;
        if (error)
            next((0, errors_1.createError)(BAD_REQUEST, error.details[0].message));
        next();
    };
};
exports.validateBody = validateBody;
