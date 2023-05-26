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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setOrderItemStatusPicked = exports.setOrderItemStatusCanceled = exports.setOrderItemStatusDelivered = exports.setOrderItemStatusShipped = exports.getUserSellOrdersCount = exports.getUserSellOrders = exports.getUserBuyOrdersCount = exports.getUserBuyOrders = void 0;
var Order_1 = __importStar(require("../models/Order"));
var http_status_codes_1 = require("http-status-codes");
var errors_1 = require("../utils/errors");
var mongoose_1 = require("mongoose");
var OK = http_status_codes_1.StatusCodes.OK, BAD_REQUEST = http_status_codes_1.StatusCodes.BAD_REQUEST, FORBIDDEN = http_status_codes_1.StatusCodes.FORBIDDEN, NOT_FOUND = http_status_codes_1.StatusCodes.NOT_FOUND;
var getUserBuyOrders = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var page, limitCount, skipCount, orders, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (typeof req.query.page !== 'string' || typeof req.query.limit !== 'string')
                    return [2 /*return*/, next((0, errors_1.createError)(BAD_REQUEST, 'invalid query params'))];
                page = parseInt(req.query.page);
                limitCount = parseInt(req.query.limit) || 10;
                skipCount = limitCount * (page - 1);
                return [4 /*yield*/, Order_1.default.find({ customer: req.user._id }, "-customer -checkoutSessionId").populate('seller', '-_id imgPath firstname lastname').skip(skipCount).limit(limitCount)];
            case 1:
                orders = _a.sent();
                res.status(OK).json(orders);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                next(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUserBuyOrders = getUserBuyOrders;
var getUserBuyOrdersCount = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, error_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _b = (_a = res.status(OK)).json;
                return [4 /*yield*/, Order_1.default.count({ customer: req.user._id })];
            case 1:
                _b.apply(_a, [_c.sent()]);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _c.sent();
                next(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUserBuyOrdersCount = getUserBuyOrdersCount;
var getUserSellOrders = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var page, limitCount, skipCount, orders, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (typeof req.query.page !== 'string' || typeof req.query.limit !== 'string')
                    return [2 /*return*/, next((0, errors_1.createError)(BAD_REQUEST, 'invalid query params'))];
                page = parseInt(req.query.page);
                limitCount = parseInt(req.query.limit) || 10;
                skipCount = limitCount * (page - 1);
                return [4 /*yield*/, Order_1.default.find({ seller: req.user._id }, "-seller -checkoutSessionId").populate('customer', '-_id imgPath firstname lastname phone email').skip(skipCount).limit(limitCount)];
            case 1:
                orders = _a.sent();
                res.status(OK).json(orders);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                next(error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUserSellOrders = getUserSellOrders;
var getUserSellOrdersCount = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, error_4;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _b = (_a = res.status(OK)).json;
                return [4 /*yield*/, Order_1.default.count({ seller: req.user._id })];
            case 1:
                _b.apply(_a, [_c.sent()]);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _c.sent();
                next(error_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUserSellOrdersCount = getUserSellOrdersCount;
var setOrderItemStatusShipped = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var orderProductId, matchedCount, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                orderProductId = req.params.orderProductId;
                if (!orderProductId || !(0, mongoose_1.isValidObjectId)(orderProductId))
                    next((0, errors_1.createError)(BAD_REQUEST, 'please provide a valid order_product_id'));
                return [4 /*yield*/, Order_1.default.updateOne({
                        _id: orderProductId,
                        paymentStatus: Order_1.OrderPaymentStatus.PAID,
                        seller: req.user._id,
                        status: Order_1.OrderStatus.PENDING
                    }, { $set: { 'products.$.status': Order_1.OrderStatus.SHIPPED } })];
            case 1:
                matchedCount = (_a.sent()).matchedCount;
                if (!matchedCount)
                    return [2 /*return*/, next((0, errors_1.createError)(BAD_REQUEST, 'failed'))];
                res.status(OK).json('success');
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                next(error_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.setOrderItemStatusShipped = setOrderItemStatusShipped;
var setOrderItemStatusDelivered = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var orderProductId, matchedCount, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                orderProductId = req.params.orderProductId;
                if (!orderProductId || !(0, mongoose_1.isValidObjectId)(orderProductId))
                    next((0, errors_1.createError)(BAD_REQUEST, 'please provide a valid order_product_id'));
                return [4 /*yield*/, Order_1.default.updateOne({
                        _id: orderProductId,
                        paymentStatus: Order_1.OrderPaymentStatus.PAID,
                        seller: req.user._id,
                        status: Order_1.OrderStatus.SHIPPED
                    }, { $set: { 'products.$.status': Order_1.OrderStatus.DELIVERED } })];
            case 1:
                matchedCount = (_a.sent()).matchedCount;
                if (!matchedCount)
                    return [2 /*return*/, next((0, errors_1.createError)(BAD_REQUEST, 'failed'))];
                res.status(OK).json('success');
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                next(error_6);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.setOrderItemStatusDelivered = setOrderItemStatusDelivered;
var setOrderItemStatusCanceled = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var orderProductId, matchedCount, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                orderProductId = req.params.orderProductId;
                if (!orderProductId || !(0, mongoose_1.isValidObjectId)(orderProductId))
                    next((0, errors_1.createError)(BAD_REQUEST, 'please provide a valid order_product_id'));
                return [4 /*yield*/, Order_1.default.updateOne({
                        _id: orderProductId,
                        paymentStatus: Order_1.OrderPaymentStatus.PAID,
                        seller: req.user._id,
                        status: { $in: [Order_1.OrderStatus.PENDING, Order_1.OrderStatus.SHIPPED] }
                    }, { $set: { 'products.$.status': Order_1.OrderStatus.CANCELED } })];
            case 1:
                matchedCount = (_a.sent()).matchedCount;
                if (!matchedCount)
                    return [2 /*return*/, next((0, errors_1.createError)(BAD_REQUEST, 'failed'))];
                res.status(OK).json('success');
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                next(error_7);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.setOrderItemStatusCanceled = setOrderItemStatusCanceled;
var setOrderItemStatusPicked = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var orderProductId, matchedCount, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                orderProductId = req.params.orderProductId;
                if (!orderProductId || !(0, mongoose_1.isValidObjectId)(orderProductId))
                    next((0, errors_1.createError)(BAD_REQUEST, 'please provide a valid order_product_id'));
                return [4 /*yield*/, Order_1.default.updateOne({
                        _id: orderProductId,
                        paymentStatus: Order_1.OrderPaymentStatus.PAID,
                        customer: req.user._id,
                        productsstatus: Order_1.OrderStatus.DELIVERED
                    }, { $set: { 'products.$.status': Order_1.OrderStatus.PICKED } })];
            case 1:
                matchedCount = (_a.sent()).matchedCount;
                if (!matchedCount)
                    return [2 /*return*/, next((0, errors_1.createError)(BAD_REQUEST, 'failed'))];
                res.status(OK).json('success');
                return [3 /*break*/, 3];
            case 2:
                error_8 = _a.sent();
                next(error_8);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.setOrderItemStatusPicked = setOrderItemStatusPicked;
