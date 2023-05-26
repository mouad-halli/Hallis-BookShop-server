"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = exports.OrderPaymentStatus = void 0;
var mongoose_1 = require("mongoose");
var OrderPaymentStatus;
(function (OrderPaymentStatus) {
    OrderPaymentStatus["PENDING"] = "pending";
    OrderPaymentStatus["EXPIRED"] = "expired";
    OrderPaymentStatus["FAILED"] = "failed";
    OrderPaymentStatus["PAID"] = "paid";
})(OrderPaymentStatus = exports.OrderPaymentStatus || (exports.OrderPaymentStatus = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["CANCELED"] = "canceled";
    OrderStatus["SHIPPED"] = "shipped";
    OrderStatus["DELIVERED"] = "delivered";
    OrderStatus["PICKED"] = "picked";
    OrderStatus["REFUNDED"] = "refunded";
})(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));
var orderSchema = new mongoose_1.Schema({
    seller: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    customer: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    product: {
        original: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Book' },
        name: String,
        imgPath: String,
        price: Number,
        quantity: Number,
    },
    status: { type: String, enum: OrderStatus, default: OrderStatus.PENDING },
    paymentStatus: { type: String, enum: OrderPaymentStatus, default: OrderPaymentStatus.PENDING },
    trackingNumber: { type: Number },
    checkoutSessionId: { type: String, select: false },
    address: { street1: String, street2: String, country: String, city: String, zipCode: String },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Order', orderSchema);
