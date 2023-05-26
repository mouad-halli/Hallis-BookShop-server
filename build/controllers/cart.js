"use strict";
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
exports.deleteProduct = exports.removeProduct = exports.addProduct = exports.findCartItemsWithProducts = exports.findCartItems = void 0;
var http_status_codes_1 = require("http-status-codes");
var mongoose_1 = require("mongoose");
var Book_1 = __importDefault(require("../models/Book"));
var Cart_1 = __importDefault(require("../models/Cart"));
var errors_1 = require("../utils/errors");
var OK = http_status_codes_1.StatusCodes.OK, BAD_REQUEST = http_status_codes_1.StatusCodes.BAD_REQUEST;
var findCartItems = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, items, cart, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.user._id;
                items = [];
                return [4 /*yield*/, Cart_1.default.findOne({ owner: userId }, '-_id -items._id')];
            case 1:
                cart = _a.sent();
                if (cart) {
                    items = cart.items.map(function (item) {
                        return { productId: item.product._id, quantity: item.quantity };
                    });
                    // items = items.map(cartItem => {
                    //     console.log(cartItem)
                    //     subTotal += (cartItem.product.price * cartItem.quantity)
                    //     return {
                    //         _id: cartItem._id,
                    //         quantity: cartItem.quantity,
                    //         productId: cartItem.product._id}
                    // })
                }
                res.status(OK).json(items);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                next(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.findCartItems = findCartItems;
var findCartItemsWithProducts = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, subTotal_1, cartItems, cart, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.user._id;
                subTotal_1 = 0;
                cartItems = [];
                return [4 /*yield*/, Cart_1.default.findOne({ owner: userId }, '-_id items').populate({
                        path: 'items',
                        populate: {
                            path: 'product', select: 'name imgPath price stockCount'
                        }
                    })];
            case 1:
                cart = _a.sent();
                if (cart) {
                    // const foundNull = cart.items.findIndex(item => !item.product)
                    // if (foundNull > -1) {
                    //     cart.items = cart.items.filter(cartItem => cartItem.product != null)
                    //     await Cart.updateOne({_id: cart._id}, { $set: cart })
                    // }
                    cart.items.forEach(function (cartItem) { return subTotal_1 += (cartItem.product.price * cartItem.quantity); });
                    cartItems = cart.items;
                }
                res.status(OK).json({ cartItems: cartItems, subTotal: subTotal_1 });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                next(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.findCartItemsWithProducts = findCartItemsWithProducts;
var addProduct = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, productId, product_1, cart, itemIndex, newCart, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 10, , 11]);
                userId = req.user._id;
                productId = req.params.productId;
                if (!productId || !(0, mongoose_1.isValidObjectId)(productId))
                    return [2 /*return*/, next((0, errors_1.createError)(BAD_REQUEST, 'invalid book id'))
                        // getting the product
                    ];
                return [4 /*yield*/, Book_1.default.findOne({ _id: productId })];
            case 1:
                product_1 = _a.sent();
                if (!product_1)
                    return [2 /*return*/, next((0, errors_1.createError)('404', "product not found"))
                        // getting user cart
                    ];
                return [4 /*yield*/, Cart_1.default.findOne({ owner: userId }).populate('items.product', 'price')
                    // if user already have a cart
                ];
            case 2:
                cart = _a.sent();
                if (!cart) return [3 /*break*/, 7];
                itemIndex = cart.items.findIndex(function (item) { return String(item.product._id) === String(product_1._id); });
                if (!(itemIndex > -1)) return [3 /*break*/, 4];
                return [4 /*yield*/, Cart_1.default.updateOne({ _id: cart._id, 'items.product': productId }, { $inc: { "items.$.quantity": 1 } })];
            case 3:
                _a.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, Cart_1.default.updateOne({ _id: cart._id }, { $push: { items: { $each: [{ product: product_1, quantity: 1 }] } } })];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: return [3 /*break*/, 9];
            case 7:
                newCart = new Cart_1.default({
                    owner: userId,
                    items: [{ product: product_1, quantity: 1 }]
                });
                return [4 /*yield*/, newCart.save()];
            case 8:
                _a.sent();
                _a.label = 9;
            case 9:
                res.status(OK).json('product added successfully');
                return [3 /*break*/, 11];
            case 10:
                error_3 = _a.sent();
                next(error_3);
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.addProduct = addProduct;
var removeProduct = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, productId, product_2, cart, itemIndex, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                userId = req.user._id;
                productId = req.params.productId;
                return [4 /*yield*/, Book_1.default.findOne({ _id: productId })];
            case 1:
                product_2 = _a.sent();
                if (!product_2)
                    return [2 /*return*/, next((0, errors_1.createError)('404', "product not found"))
                        // getting user cart
                    ];
                return [4 /*yield*/, Cart_1.default.findOne({ owner: userId }).populate('items.product', 'price')];
            case 2:
                cart = _a.sent();
                if (!cart)
                    return [2 /*return*/, next((0, errors_1.createError)('404', "user doesn't have a cart"))
                        //searching product inside the user cart
                    ];
                itemIndex = cart.items.findIndex(function (item) { return String(item.product._id) === String(product_2._id); });
                if (itemIndex < 0)
                    return [2 /*return*/, next((0, errors_1.createError)(404, "couldn't find product in user Cart"))
                        // if product quantity will be 0 we remove it from the cart
                    ];
                if (!(cart.items[itemIndex].quantity > 1)) return [3 /*break*/, 4];
                // cart.items[itemIndex].quantity -= 1
                return [4 /*yield*/, Cart_1.default.updateOne({ _id: cart._id, 'items.product': productId }, { $inc: { "items.$.quantity": -1 } })];
            case 3:
                // cart.items[itemIndex].quantity -= 1
                _a.sent();
                return [3 /*break*/, 6];
            case 4: 
            // cart.items.splice(itemIndex, 1)
            return [4 /*yield*/, Cart_1.default.updateOne({ _id: cart._id }, { $pull: { 'items': { 'product': productId } } })
                // await Cart.findByIdAndUpdate(cart._id, { $set: cart }/*, { new: true }*/)
            ];
            case 5:
                // cart.items.splice(itemIndex, 1)
                _a.sent();
                _a.label = 6;
            case 6:
                // await Cart.findByIdAndUpdate(cart._id, { $set: cart }/*, { new: true }*/)
                res.status(OK).json('product removed succesffuly');
                return [3 /*break*/, 8];
            case 7:
                error_4 = _a.sent();
                next(error_4);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.removeProduct = removeProduct;
var deleteProduct = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, productId_1, cart, itemIndex, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                userId = req.user._id;
                productId_1 = req.params.productId;
                return [4 /*yield*/, Cart_1.default.findOne({ owner: userId }).populate('items.product', '_id')];
            case 1:
                cart = _a.sent();
                if (!cart)
                    return [2 /*return*/, next((0, errors_1.createError)('404', "user doesn't have a cart"))];
                itemIndex = cart.items.findIndex(function (item) { return String(item.product._id) === String(productId_1); });
                if (itemIndex < 0)
                    return [2 /*return*/, next((0, errors_1.createError)(404, "couldn't find product in user Cart"))];
                cart.items.splice(itemIndex, 1);
                return [4 /*yield*/, Cart_1.default.findByIdAndUpdate(cart._id, { $set: cart } /*, { new: true }*/)];
            case 2:
                _a.sent();
                res.status(OK).json('product removed succesffuly');
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                next(error_5);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteProduct = deleteProduct;
