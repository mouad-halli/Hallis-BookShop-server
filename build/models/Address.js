"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var addressSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    street1: { type: String, },
    street2: { type: String, },
    country: { type: String, },
    city: { type: String, },
    zipCode: { type: String },
});
exports.default = (0, mongoose_1.model)('Address', addressSchema);
