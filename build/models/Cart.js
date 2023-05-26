"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartItemScema = void 0;
var mongoose_1 = require("mongoose");
exports.cartItemScema = new mongoose_1.Schema({
    product: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Book' },
    quantity: { type: Number, required: true, default: 0, min: [1, 'quantity cannot be less than 1.'] },
});
var cartSchema = new mongoose_1.Schema({
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    items: [exports.cartItemScema],
} /*, { timestamps: true }*/);
exports.default = (0, mongoose_1.model)('Cart', cartSchema);
