import { Router } from 'express';
import { verifyToken } from '../utils/verify';
import { getUserOrders } from '../controllers/order';

const router = Router()

router.get('/', verifyToken, getUserOrders)


export default router