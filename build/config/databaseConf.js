"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var envConfig_1 = require("./envConfig");
var connectToDatabase = function () {
    try {
        mongoose_1.default.connect(String(envConfig_1.DB_LINK));
    }
    catch (error) {
        throw error;
    }
};
exports.connectToDatabase = connectToDatabase;
mongoose_1.default.connection.on('connected', function () {
    console.log('database connected');
});
mongoose_1.default.connection.on('disconnected', function () {
    console.log('database disconnected');
});
