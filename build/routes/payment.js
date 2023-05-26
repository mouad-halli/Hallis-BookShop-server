"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var verify_1 = require("../utils/verify");
var payment_1 = require("../controllers/payment");
var express_2 = __importDefault(require("express"));
var router = (0, express_1.Router)();
router.post('/create-stripe-checkout-session', express_2.default.json(), verify_1.verifyToken, payment_1.stripeCheckout);
router.post('/stripe-webhook', express_2.default.raw({ type: 'application/json' }), payment_1.stripeWebHook);
exports.default = router;
