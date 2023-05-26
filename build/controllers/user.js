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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllUserWithBooks = exports.getAllUsers = exports.getUser = exports.deleteUser = exports.setUserImage = exports.updateUser = exports.deleteUserAddress = exports.updateUserAddress = exports.getUserAddress = exports.createUserAddress = exports.me = void 0;
var User_1 = __importDefault(require("../models/User"));
var http_status_codes_1 = require("http-status-codes");
var errors_1 = require("../utils/errors");
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var Address_1 = __importDefault(require("../models/Address"));
var envConfig_1 = require("../config/envConfig");
var OK = http_status_codes_1.StatusCodes.OK, CREATED = http_status_codes_1.StatusCodes.CREATED, BAD_REQUEST = http_status_codes_1.StatusCodes.BAD_REQUEST, NOT_FOUND = http_status_codes_1.StatusCodes.NOT_FOUND;
var me = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var me_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, User_1.default.findById(req.user._id, "-__v -googleId -books")];
            case 1:
                me_1 = _a.sent();
                if (!me_1)
                    res.status((0, errors_1.createError)(NOT_FOUND, "user not found"));
                res.status(OK).json(me_1);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                next(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.me = me;
var createUserAddress = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userAddress, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, Address_1.default.findOne({ user: req.user._id })];
            case 1:
                userAddress = _a.sent();
                if (userAddress)
                    return [2 /*return*/, next((0, errors_1.createError)(BAD_REQUEST, 'user already have an address'))];
                return [4 /*yield*/, new Address_1.default({
                        user: req.user._id,
                        street1: req.body.street1,
                        street2: req.body.street2,
                        country: req.body.country,
                        city: req.body.city,
                        zipCode: req.body.zipCode
                    }).save().then(function (address) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, User_1.default.updateOne({ _id: req.user._id }, { address: address })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/, address];
                            }
                        });
                    }); })];
            case 2:
                userAddress = _a.sent();
                res.status(CREATED).json(userAddress);
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                next(error_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createUserAddress = createUserAddress;
var getUserAddress = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userAddress, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Address_1.default.findOne({ user: req.user._id }, "-_id -__v -user")
                    // if (!userAddress)
                    //     return next(createError(NOT_FOUND, 'user address not found'))
                ];
            case 1:
                userAddress = _a.sent();
                // if (!userAddress)
                //     return next(createError(NOT_FOUND, 'user address not found'))
                res.status(OK).json(userAddress);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                next(error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUserAddress = getUserAddress;
var updateUserAddress = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Address_1.default.findOneAndUpdate({ user: req.user._id }, {
                        $set: req.body
                    })];
            case 1:
                _a.sent();
                res.status(CREATED).json(req.body);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                next(error_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateUserAddress = updateUserAddress;
var deleteUserAddress = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Address_1.default.findOneAndDelete({ user: req.user._id })];
            case 1:
                _a.sent();
                res.status(OK).json('deleted successfully');
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                next(error_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteUserAddress = deleteUserAddress;
var updateUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var salt, hash, _a, password, responseData, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 10, , 11]);
                if (!req.body.username) return [3 /*break*/, 2];
                return [4 /*yield*/, User_1.default.findOne({ $and: [{ username: req.body.username }, { _id: { $ne: req.user._id } }] })];
            case 1:
                if (_b.sent())
                    return [2 /*return*/, next((0, errors_1.createError)(BAD_REQUEST, "this username is already in use"))];
                _b.label = 2;
            case 2:
                if (!req.body.password) return [3 /*break*/, 5];
                return [4 /*yield*/, bcryptjs_1.default.genSalt(10)];
            case 3:
                salt = _b.sent();
                return [4 /*yield*/, bcryptjs_1.default.hash(req.body.password, salt)];
            case 4:
                hash = _b.sent();
                req.body.password = hash;
                _b.label = 5;
            case 5:
                if (!req.body.email) return [3 /*break*/, 7];
                return [4 /*yield*/, User_1.default.findOne({ $and: [{ email: req.body.email }, { _id: { $ne: req.user._id } }] })];
            case 6:
                if (_b.sent())
                    return [2 /*return*/, next((0, errors_1.createError)(BAD_REQUEST, "this email is already in use"))];
                _b.label = 7;
            case 7:
                if (!req.body) return [3 /*break*/, 9];
                return [4 /*yield*/, User_1.default.findByIdAndUpdate(req.user._id, { $set: req.body }, 
                    // { new: true, fields: { password: 0 } }
                    { new: true })];
            case 8:
                _b.sent();
                _b.label = 9;
            case 9:
                _a = req.body, password = _a.password, responseData = __rest(_a, ["password"]);
                res.status(CREATED).json(responseData);
                return [3 /*break*/, 11];
            case 10:
                error_6 = _b.sent();
                next(error_6);
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.updateUser = updateUser;
var setUserImage = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var imgPath, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!req.file)
                    return [2 /*return*/, next((0, errors_1.createError)(BAD_REQUEST, 'please provide an image'))];
                imgPath = "".concat(envConfig_1.SERVER_URL, "/").concat(req.file.path);
                return [4 /*yield*/, User_1.default.findOneAndUpdate({ _id: req.user._id }, { imgPath: imgPath })];
            case 1:
                _a.sent();
                res.status(CREATED).json(imgPath);
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                next(error_7);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.setUserImage = setUserImage;
var deleteUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, User_1.default.findByIdAndDelete(req.params.id)];
            case 1:
                _a.sent();
                res.status(OK).json("User deleted succesfully");
                return [3 /*break*/, 3];
            case 2:
                error_8 = _a.sent();
                next(error_8);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteUser = deleteUser;
var getUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, User_1.default.findById(req.params.id)];
            case 1:
                user = _a.sent();
                res.status(OK).json(user);
                return [3 /*break*/, 3];
            case 2:
                error_9 = _a.sent();
                next(error_9);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUser = getUser;
var getAllUsers = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var users, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, User_1.default.find()];
            case 1:
                users = _a.sent();
                res.status(OK).json(users);
                return [3 /*break*/, 3];
            case 2:
                error_10 = _a.sent();
                next(error_10);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllUsers = getAllUsers;
var findAllUserWithBooks = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var minBooks, users, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                minBooks = Number(req.params.min_books) || 6;
                return [4 /*yield*/, User_1.default.find({ $expr: { $gte: [{ $size: "$books" }, minBooks] } }, { firstname: 1, lastname: 1, username: 1, imgPath: 1, books: 1 }).populate({ path: 'books', match: { archived: false }, select: 'imgPath' })];
            case 1:
                users = _a.sent();
                res.status(OK).json(users.filter(function (user) { return user.books.length > 0; }));
                return [3 /*break*/, 3];
            case 2:
                error_11 = _a.sent();
                next(error_11);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.findAllUserWithBooks = findAllUserWithBooks;
