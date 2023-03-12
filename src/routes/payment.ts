import { Router } from 'express';
import { verifyToken } from '../utils/verify';
import { stripeCheckout, stripeWebHook } from '../controllers/payment';
import express from 'express'

const router = Router()

router.post('/create-stripe-checkout-session', express.json(), verifyToken, stripeCheckout)

router.post('/stripe-webhook', express.raw({type: 'application/json'}), stripeWebHook)

export default router