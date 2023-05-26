"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var book_1 = require("../controllers/book");
var multer_1 = __importDefault(require("multer"));
var multerConf_1 = require("../config/multerConf");
var verify_1 = require("../utils/verify");
var validation_1 = require("../controllers/validation");
var validator_1 = require("../validator");
var upload = (0, multer_1.default)(multerConf_1.multerOptions);
var router = (0, express_1.Router)();
router.get("/listed", verify_1.verifyToken, book_1.findUserBooks);
router.get('/last-added/:limit', book_1.findLastAddedBooks);
router.get('/by-language', book_1.findBooksByLanguage);
router.get('/by-genre', book_1.findBooksByGenre);
router.get('/by-author', book_1.findAuthorBooks);
router.get('/seller-books/:sellerId', book_1.findSellerBooks);
router.get('/search', book_1.searchBooks);
router.get('/:id', book_1.findBook);
router.get('/sellers/:limit', book_1.findSellers);
router.post('/', verify_1.verifyToken, (0, validation_1.validateBody)(validator_1.validatecreateBook), book_1.createBook);
router.put('/:id', verify_1.verifyToken, (0, validation_1.validateBody)(validator_1.validateUpdateBook), book_1.updateBook);
router.put('/set-img/:id', verify_1.verifyToken, upload.single('img'), book_1.setBookImage);
// router.delete('/', deleteAll)
router.delete('/:id', verify_1.verifyToken, book_1.deleteBook);
exports.default = router;
