"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var user_1 = require("../controllers/user");
var verify_1 = require("../utils/verify");
var multer_1 = __importDefault(require("multer"));
var multerConf_1 = require("../config/multerConf");
var validation_1 = require("../controllers/validation");
var validator_1 = require("../validator");
var upload = (0, multer_1.default)(multerConf_1.multerOptions);
var router = (0, express_1.Router)();
router.put('/', verify_1.verifyToken, (0, validation_1.validateBody)(validator_1.validateUpdateUser), user_1.updateUser);
router.put('/set-img', verify_1.verifyToken, upload.single('img'), user_1.setUserImage);
router.put('/address', verify_1.verifyToken, (0, validation_1.validateBody)(validator_1.validateUpdateAddress), user_1.updateUserAddress);
router.delete('/address', verify_1.verifyToken, user_1.deleteUserAddress);
router.post('/address', verify_1.verifyToken, (0, validation_1.validateBody)(validator_1.validateCreateAddress), user_1.createUserAddress);
router.get('/me', verify_1.verifyToken, user_1.me);
router.get('/address', verify_1.verifyToken, user_1.getUserAddress);
router.get('/', verify_1.verifyAdmin, user_1.getAllUsers);
router.get('/users-books/:min_books', user_1.findAllUserWithBooks);
exports.default = router;
