"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createError = void 0;
var createError = function (status, message) {
    var error = new Error(message);
    error.status = status;
    return error;
};
exports.createError = createError;
