import { Router } from 'express';
import { verifyToken } from '../utils/verify';
import { getUserBuyOrders, getUserSellOrders, setOrderItemStatusCanceled, setOrderItemStatusDelivered, setOrderItemStatusPicked, setOrderItemStatusShipped } from '../controllers/order';

const router = Router()

router.get('/buy', verifyToken, getUserBuyOrders)

router.get('/sell', verifyToken, getUserSellOrders)

router.put('/status-shipped', verifyToken, setOrderItemStatusShipped)

router.put('/status-delivered', verifyToken, setOrderItemStatusDelivered)

router.put('/status-canceled', verifyToken, setOrderItemStatusCanceled)

router.put('/status-picked', verifyToken, setOrderItemStatusPicked)

export default router