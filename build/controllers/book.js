"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.deleteAll = exports.deleteBook = exports.setBookImage = exports.updateBook = exports.createBook = exports.findUserBooks = exports.findAllBooks = exports.findBook = exports.findLastAddedBooks = exports.searchBooks = exports.findAuthorBooks = exports.findBooksByGenre = exports.findBooksByLanguage = exports.findSellerBooks = exports.findSellers = void 0;
var http_status_codes_1 = require("http-status-codes");
var errors_1 = require("../utils/errors");
var Book_1 = __importDefault(require("../models/Book"));
var User_1 = __importDefault(require("../models/User"));
var mongoose_1 = require("mongoose");
var envConfig_1 = require("../config/envConfig");
var Cart_1 = __importDefault(require("../models/Cart"));
var OK = http_status_codes_1.StatusCodes.OK, CREATED = http_status_codes_1.StatusCodes.CREATED, BAD_REQUEST = http_status_codes_1.StatusCodes.BAD_REQUEST, NOT_FOUND = http_status_codes_1.StatusCodes.NOT_FOUND;
var findSellers = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var booksLimit, sellersIds, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                booksLimit = req.params.limit;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Book_1.default.find().distinct('seller')
                    // const sellersBooks = sellersIds.map(async (sellerId) => {
                    //     const books = await Book.find({seller: sellerId}).limit(booksLimit)
                    //     if (!books)
                    //         return
                    //     return {sellerId, books}
                    // })
                    // const data = await Promise.all(sellersBooks)
                    // res.status(OK).json(data)
                ];
            case 2:
                sellersIds = _a.sent();
                // const sellersBooks = sellersIds.map(async (sellerId) => {
                //     const books = await Book.find({seller: sellerId}).limit(booksLimit)
                //     if (!books)
                //         return
                //     return {sellerId, books}
                // })
                // const data = await Promise.all(sellersBooks)
                // res.status(OK).json(data)
                res.status(OK).json(sellersIds);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                next(error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.findSellers = findSellers;
var findSellerBooks = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var seller, limit, books, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, User_1.default.findOne({ _id: req.params.sellerId })];
            case 1:
                seller = _a.sent();
                if (!seller)
                    next((0, errors_1.createError)(NOT_FOUND, 'seller not found'));
                limit = Number(req.params.limit) || 4;
                return [4 /*yield*/, Book_1.default.find({ seller: seller }).limit(limit).limit(6).populate('seller', 'imgPath username')];
            case 2:
                books = _a.sent();
                res.status(OK).json(books);
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                next(error_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.findSellerBooks = findSellerBooks;
var findBooksByLanguage = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var books, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Book_1.default.find({ bookLanguage: req.query.q, archived: false })];
            case 1:
                books = _a.sent();
                res.status(OK).json(books);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                next(error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.findBooksByLanguage = findBooksByLanguage;
var findBooksByGenre = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var books, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Book_1.default.find({ genre: req.query.q, archived: false })];
            case 1:
                books = _a.sent();
                res.status(OK).json(books);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                next(error_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.findBooksByGenre = findBooksByGenre;
var findAuthorBooks = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var books, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Book_1.default.find({ author: req.query.q, archived: false })];
            case 1:
                books = _a.sent();
                res.status(OK).json(books);
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                next(error_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.findAuthorBooks = findAuthorBooks;
var searchBooks = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var searchQuery, searchResult, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                searchQuery = String(req.query.q);
                return [4 /*yield*/, Book_1.default.find({ archived: false, $text: { $search: searchQuery, $caseSensitive: false } }, "-__v").populate({ path: 'seller', select: '_id' })];
            case 1:
                searchResult = _a.sent();
                res.status(OK).json(searchResult);
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                next(error_6);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.searchBooks = searchBooks;
var findLastAddedBooks = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var limit, books, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                limit = Number(req.params.limit) || 5;
                return [4 /*yield*/, Book_1.default.find({ archived: false }).sort([['_id', -1]]).select({ _id: 1, imgPath: 1, name: 1, author: 1, price: 1, genre: 1, description: 1 }).limit(limit)];
            case 1:
                books = _a.sent();
                res.status(OK).json(books);
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                next(error_7);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.findLastAddedBooks = findLastAddedBooks;
var findBook = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var bookId, book, error_8;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                bookId = req.params.id;
                if (!(0, mongoose_1.isValidObjectId)(bookId))
                    return [2 /*return*/, next((0, errors_1.createError)(400, "invalid book id"))];
                if (!bookId)
                    return [2 /*return*/, next((0, errors_1.createError)(400, "please enter the Book id"))];
                return [4 /*yield*/, Book_1.default.findOne({ _id: bookId, archived: false }).populate({ path: 'seller', select: 'username firstname lastname books', populate: { path: 'books', select: 'imgPath' } })];
            case 1:
                book = _b.sent();
                if (!book)
                    return [2 /*return*/, next((0, errors_1.createError)(404, "book not found"))];
                if (book.seller.books && ((_a = book.seller.books) === null || _a === void 0 ? void 0 : _a.length) > 4)
                    book.seller.books = book.seller.books.slice(0, 4);
                res.status(OK).json(book);
                return [3 /*break*/, 3];
            case 2:
                error_8 = _b.sent();
                next(error_8);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.findBook = findBook;
var findAllBooks = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var books, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Book_1.default.find({ archived: false })];
            case 1:
                books = _a.sent();
                res.status(OK).json(books);
                return [3 /*break*/, 3];
            case 2:
                error_9 = _a.sent();
                next(error_9);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.findAllBooks = findAllBooks;
var findUserBooks = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var books, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Book_1.default.find({ 'seller': req.user._id, archived: false }, '-__v')];
            case 1:
                books = _a.sent();
                res.status(OK).json(books);
                return [3 /*break*/, 3];
            case 2:
                error_10 = _a.sent();
                next(error_10);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.findUserBooks = findUserBooks;
var createBook = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var newBook;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                newBook = new Book_1.default(__assign(__assign({}, req.body), { seller: req.user._id }));
                return [4 /*yield*/, newBook.save()
                        .then(function (book) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, User_1.default.findByIdAndUpdate(req.user._id, { $push: { books: book._id } })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 1:
                _a.sent();
                res.status(CREATED).json(newBook._id);
                return [2 /*return*/];
        }
    });
}); };
exports.createBook = createBook;
var updateBook = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var bookId, updatedBook;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                bookId = req.params.id;
                if (!bookId || !(0, mongoose_1.isValidObjectId)(bookId))
                    return [2 /*return*/, next((0, errors_1.createError)(BAD_REQUEST, "invalid book id"))];
                return [4 /*yield*/, Book_1.default.findOneAndUpdate({ _id: bookId, archived: false }, { $set: req.body }, { new: true })];
            case 1:
                updatedBook = _a.sent();
                res.status(CREATED).json(updatedBook);
                return [2 /*return*/];
        }
    });
}); };
exports.updateBook = updateBook;
var setBookImage = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var bookId, imgPath, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                bookId = req.params.id;
                if (!bookId || !(0, mongoose_1.isValidObjectId)(bookId))
                    return [2 /*return*/, next((0, errors_1.createError)(BAD_REQUEST, "invalid book id"))];
                if (!req.file)
                    return [2 /*return*/, next((0, errors_1.createError)(BAD_REQUEST, "please upload an image"))];
                imgPath = "".concat(envConfig_1.SERVER_URL, "/").concat(req.file.path);
                return [4 /*yield*/, Book_1.default.findOneAndUpdate({ _id: bookId, archived: false }, { imgPath: imgPath })];
            case 1:
                _a.sent();
                res.status(CREATED).json(imgPath);
                return [3 /*break*/, 3];
            case 2:
                error_11 = _a.sent();
                next(error_11);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.setBookImage = setBookImage;
var deleteBook = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var bookId, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                bookId = req.params.id;
                if (!bookId || !(0, mongoose_1.isValidObjectId)(bookId))
                    return [2 /*return*/, next((0, errors_1.createError)(400, "invalid book id"))];
                return [4 /*yield*/, Cart_1.default.updateMany({ "items.product": bookId }, { $pull: { items: { 'product': bookId } } })
                    // const bookImgFileName = await Book.findOneAndDelete({_id: bookId, seller: req.user._id}).then( async (book: IBook) => {
                    //     return book.imgPath.split('/').at(-1)
                    // })
                ];
            case 1:
                _a.sent();
                // const bookImgFileName = await Book.findOneAndDelete({_id: bookId, seller: req.user._id}).then( async (book: IBook) => {
                //     return book.imgPath.split('/').at(-1)
                // })
                return [4 /*yield*/, Book_1.default.findOneAndUpdate({ _id: bookId, seller: req.user._id }, { archived: true })
                    // deleteFileIfExist(bookImgFileName)
                ];
            case 2:
                // const bookImgFileName = await Book.findOneAndDelete({_id: bookId, seller: req.user._id}).then( async (book: IBook) => {
                //     return book.imgPath.split('/').at(-1)
                // })
                _a.sent();
                // deleteFileIfExist(bookImgFileName)
                res.status(OK).json("Book deleted succesfully");
                return [3 /*break*/, 4];
            case 3:
                error_12 = _a.sent();
                next(error_12);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteBook = deleteBook;
var deleteAll = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Book_1.default.deleteMany()];
            case 1:
                _a.sent();
                res.status(OK).json('all books has been deleted');
                return [2 /*return*/];
        }
    });
}); };
exports.deleteAll = deleteAll;
