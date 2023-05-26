"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cart_1 = require("../controllers/cart");
var verify_1 = require("../utils/verify");
var router = (0, express_1.Router)();
router.get('/', verify_1.verifyToken, cart_1.findCartItems);
router.get('/cart-products', verify_1.verifyToken, cart_1.findCartItemsWithProducts);
router.post('/add-product/:productId', verify_1.verifyToken, cart_1.addProduct);
router.post('/remove-product/:productId', verify_1.verifyToken, cart_1.removeProduct);
// router.put('/', verifyToken, )
router.delete('/delete-product/:productId', verify_1.verifyToken, cart_1.deleteProduct);
exports.default = router;
