import { Router } from "express";
import { addProduct, deleteProduct, findCartItems, findCartItemsWithProducts, removeProduct } from "../controllers/cart";
import { verifyToken } from "../utils/verify";

const router = Router()

router.get('/', verifyToken, findCartItems)

router.get('/cart-products', verifyToken, findCartItemsWithProducts)

router.post('/add-product/:productId', verifyToken, addProduct)

router.post('/remove-product/:productId', verifyToken, removeProduct)

// router.put('/', verifyToken, )

router.delete('/delete-product/:productId', verifyToken, deleteProduct)

export default router