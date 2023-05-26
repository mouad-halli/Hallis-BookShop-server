"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebHook = exports.stripeCheckout = void 0;
var envConfig_1 = require("../config/envConfig");
var stripe_1 = __importDefault(require("stripe"));
var Cart_1 = __importDefault(require("../models/Cart"));
var http_status_codes_1 = require("http-status-codes");
var Order_1 = __importStar(require("../models/Order"));
var errors_1 = require("../utils/errors");
var User_1 = __importDefault(require("../models/User"));
var Book_1 = __importDefault(require("../models/Book"));
var ACCEPTED = http_status_codes_1.StatusCodes.ACCEPTED, OK = http_status_codes_1.StatusCodes.OK, BAD_REQUEST = http_status_codes_1.StatusCodes.BAD_REQUEST, FORBIDDEN = http_status_codes_1.StatusCodes.FORBIDDEN, NOT_FOUND = http_status_codes_1.StatusCodes.NOT_FOUND;
// with the CLI, find the secret by running 'stripe listen'
var endpointSecret = envConfig_1.STRIPE_WEBHOOK_ENDPOINT_SECRET;
var stripe = new stripe_1.default(envConfig_1.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });
var stripeCheckout = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var cart, customerId, userAddress, customer, line_items_1, session_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                return [4 /*yield*/, Cart_1.default.findOne({ owner: req.user._id }, '-_id -items._id').populate([
                        { path: 'items.product', select: 'name price imgPath stockCount seller' },
                        { path: 'owner', select: 'firstname lastname phone stripeCustomerId', populate: { path: 'address', select: '-_id -user' } },
                    ])];
            case 1:
                cart = _a.sent();
                if (!cart)
                    return [2 /*return*/, next((0, errors_1.createError)(NOT_FOUND, "couldn't find user Cart"))];
                if (cart.items.length < 1)
                    return [2 /*return*/, next((0, errors_1.createError)(NOT_FOUND, "your cart is empty"))];
                if (!cart.owner.address)
                    return [2 /*return*/, next((0, errors_1.createError)(NOT_FOUND, "please fill your address"))];
                if (!cart.owner.firstname || !cart.owner.lastname)
                    return [2 /*return*/, next((0, errors_1.createError)(NOT_FOUND, "please fill you firstname and lastname"))];
                if (!cart.owner.phone)
                    return [2 /*return*/, next((0, errors_1.createError)(NOT_FOUND, "please fill you phone number"))];
                customerId = cart.owner.stripeCustomerId;
                if (!!customerId) return [3 /*break*/, 4];
                userAddress = cart.owner.address;
                return [4 /*yield*/, stripe.customers.create({
                        phone: cart.owner.phone,
                        email: cart.owner.email,
                        shipping: {
                            address: {
                                city: userAddress.city,
                                country: userAddress.country,
                                line1: userAddress.street1,
                                line2: userAddress.street2,
                                postal_code: userAddress.zipCode,
                            },
                            name: "".concat(cart.owner.firstname, " ").concat(cart.owner.lastname),
                            phone: cart.owner.phone
                        }
                    })];
            case 2:
                customer = _a.sent();
                return [4 /*yield*/, User_1.default.findByIdAndUpdate(cart.owner._id, { stripeCustomerId: customer.id })];
            case 3:
                _a.sent();
                customerId = customer.id;
                _a.label = 4;
            case 4:
                line_items_1 = [];
                cart.items.forEach(function (item) { return __awaiter(void 0, void 0, void 0, function () {
                    var quantity, _a, name, imgPath, price;
                    return __generator(this, function (_b) {
                        quantity = item.quantity;
                        _a = item.product, name = _a.name, imgPath = _a.imgPath, price = _a.price;
                        line_items_1.push({
                            price_data: {
                                currency: 'usd',
                                product_data: {
                                    name: name,
                                    images: [imgPath]
                                },
                                unit_amount: Number(price * 100)
                            },
                            quantity: quantity
                        });
                        return [2 /*return*/];
                    });
                }); });
                return [4 /*yield*/, stripe.checkout.sessions.create({
                        line_items: line_items_1,
                        customer: customerId,
                        payment_method_types: ['card'],
                        mode: 'payment',
                        // success_url: SERVER_URL + "/payment/success?session_id={CHECKOUT_SESSION_ID}",
                        success_url: envConfig_1.CLIENT_URL,
                        cancel_url: envConfig_1.CLIENT_URL,
                        expires_at: Math.floor((new Date().getTime() + 1800000) / 1000)
                    })];
            case 5:
                session_1 = _a.sent();
                cart.items.forEach(function (item) { return __awaiter(void 0, void 0, void 0, function () {
                    var quantity, _a, _id, name, imgPath, price, seller;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                quantity = item.quantity;
                                _a = item.product, _id = _a._id, name = _a.name, imgPath = _a.imgPath, price = _a.price, seller = _a.seller;
                                new Order_1.default({
                                    seller: seller,
                                    customer: req.user._id,
                                    checkoutSessionId: session_1.id,
                                    product: { original: item.product, name: name, imgPath: imgPath, price: price, quantity: quantity }
                                }).save();
                                return [4 /*yield*/, Book_1.default.findByIdAndUpdate(_id, { $inc: { stockCount: -quantity } })];
                            case 1:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                res.status(ACCEPTED).json(session_1.url);
                return [3 /*break*/, 7];
            case 6:
                error_1 = _a.sent();
                next(error_1);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.stripeCheckout = stripeCheckout;
var stripeWebHook = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var event, signature, isUnhandledEvent, orderStatus, orders, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                event = req.body;
                if (endpointSecret) {
                    signature = req.headers['stripe-signature'];
                    try {
                        event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
                    }
                    catch (err) {
                        console.log("\u26A0\uFE0F  Webhook signature verification failed.", err.message);
                        return [2 /*return*/, res.sendStatus(BAD_REQUEST)];
                    }
                }
                isUnhandledEvent = false;
                orderStatus = Order_1.OrderPaymentStatus.PAID;
                // Handle the events
                switch (event.type) {
                    case 'checkout.session.completed': {
                        break;
                    }
                    case 'payment_intent.payment_failed': {
                        orderStatus = Order_1.OrderPaymentStatus.FAILED;
                        break;
                    }
                    case 'checkout.session.expired': {
                        orderStatus = Order_1.OrderPaymentStatus.EXPIRED;
                        break;
                    }
                    default:
                        // Unexpected event type
                        isUnhandledEvent = true;
                        console.log("Unhandled event type ".concat(event.type, "."));
                }
                if (!(isUnhandledEvent === false)) return [3 /*break*/, 4];
                return [4 /*yield*/, Order_1.default.updateMany({ checkoutSessionId: event.data.object.id }, { paymentStatus: orderStatus })];
            case 1:
                _a.sent();
                return [4 /*yield*/, Order_1.default.find({ checkoutSessionId: event.data.object.id })];
            case 2:
                orders = _a.sent();
                if (orderStatus !== Order_1.OrderPaymentStatus.PAID)
                    orders.forEach(function (order) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, Book_1.default.findByIdAndUpdate(order.product.original, { $inc: { stockCount: order.product.quantity } })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                if (!(orderStatus === Order_1.OrderPaymentStatus.PAID)) return [3 /*break*/, 4];
                return [4 /*yield*/, Cart_1.default.updateOne({ owner: orders[0].customer }, { $set: { items: [] } })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                res.status(OK);
                return [3 /*break*/, 6];
            case 5:
                error_2 = _a.sent();
                console.log(error_2);
                next(error_2);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.stripeWebHook = stripeWebHook;
