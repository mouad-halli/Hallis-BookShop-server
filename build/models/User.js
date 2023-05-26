"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var UserSchema = new mongoose_1.Schema({
    username: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    imgPath: { type: String },
    password: { type: String, select: false },
    googleId: { type: Number },
    phone: { type: String },
    email: { type: String },
    address: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Address' },
    books: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Book' }],
    stripeCustomerId: { type: String, default: null, select: false },
});
exports.default = (0, mongoose_1.model)('User', UserSchema);
