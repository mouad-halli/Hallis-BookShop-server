import { STRIPE_SECRET_KEY, SERVER_URL, STRIPE_WEBHOOK_ENDPOINT_SECRET, CLIENT_URL } from '../config/envConfig'
import Stripe from 'stripe'
import { NextFunction, Response, Request } from 'express';
import Cart, {ICartItem, ICart} from '../models/Cart';
import { IGetUserAuthInfoRequest } from '../config/typesConf';
import { StatusCodes } from 'http-status-codes';
import Order, { OrderPaymentStatus, OrderProduct } from '../models/Order';
import { createError } from '../utils/errors';
import User from '../models/User';
import Book from '../models/Book';

const { ACCEPTED, OK, BAD_REQUEST, FORBIDDEN, NOT_FOUND } = StatusCodes
// with the CLI, find the secret by running 'stripe listen'
const endpointSecret = STRIPE_WEBHOOK_ENDPOINT_SECRET

const stripe = new Stripe(STRIPE_SECRET_KEY, {apiVersion: '2022-11-15'})

export const stripeCheckout = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
        const cart: ICart = await Cart.findOne({owner: req.user._id}, '-_id -items._id').populate<{items: ICartItem[]}>([
			{ path: 'items.product', select: 'name price imgPath stockCount seller' },
			{ path: 'owner', select: 'firstname lastname phone stripeCustomerId', populate: { path: 'address', select: '-_id -user' } },
		])

		if (!cart)
			return next(createError(NOT_FOUND, `couldn't find user Cart`))

		if (cart.items.length < 1)
			return next(createError(NOT_FOUND, `your cart is empty`))

		if (!cart.owner.address)
			return next(createError(NOT_FOUND, `please fill your address`))
		
		if (!cart.owner.firstname || !cart.owner.lastname)
			return next(createError(NOT_FOUND, `please fill you firstname and lastname`))

		if (!cart.owner.phone)
			return next(createError(NOT_FOUND, `please fill you phone number`))

		let customerId = cart.owner.stripeCustomerId
		
		if (!customerId) {
			const userAddress = cart.owner.address
			const customer = await stripe.customers.create({
				phone: cart.owner.phone,
				email: cart.owner.email,
				shipping: {
					address: {
						city: userAddress.city,
						country: userAddress.country,
						line1: userAddress.street1,
						line2: userAddress.street2,
						postal_code: userAddress.zipCode,
					},
					name: `${cart.owner.firstname} ${cart.owner.lastname}`,
					phone: cart.owner.phone
				}
			})
			await User.findByIdAndUpdate(cart.owner._id, { stripeCustomerId: customer.id })
			customerId = customer.id
		}

		const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []

		cart.items.forEach(async(item) => {

			const { quantity } = item

			const { name, imgPath, price } = item.product

			line_items.push({
				price_data: {
					currency: 'usd',
					product_data: {
						name: name,
						images: [imgPath]
					},
					unit_amount: Number(price * 100)
				},
				quantity: quantity
			})
		})

        const session = await stripe.checkout.sessions.create({
			line_items: line_items,
			customer: customerId,
            payment_method_types: ['card'],
            mode: 'payment',
            // success_url: SERVER_URL + "/payment/success?session_id={CHECKOUT_SESSION_ID}",
            success_url: CLIENT_URL,
            cancel_url: CLIENT_URL,
			expires_at: Math.floor( (new Date().getTime() + 1800000) / 1000 )
        })

		cart.items.forEach( async (item) => {
			const { quantity } = item
			const { _id, name, imgPath, price, seller } = item.product

			new Order({
				seller: seller,
				customer: req.user._id,
				checkoutSessionId: session.id,
				product: { original: item.product,  name, imgPath, price, quantity }
			}).save()

			await Book.findByIdAndUpdate(_id, { $inc: { stockCount: -quantity } })
		})

        res.status(ACCEPTED).json( session.url )

    } catch (error) {
        next(error)
    }
}

export const stripeWebHook = async (req: Request, res: Response, next: NextFunction) => {

	try {

		let event = req.body;

		if (endpointSecret) {
			// Get the signature sent by Stripe
			const signature = req.headers['stripe-signature']
			try {
				event = stripe.webhooks.constructEvent(
				  req.body,
				  signature,
				  endpointSecret
				)
			} catch (err) {
			  console.log(`⚠️  Webhook signature verification failed.`, err.message)
			  return res.sendStatus(BAD_REQUEST)
			}
		}
	
		let isUnhandledEvent: boolean = false
		let orderStatus: OrderPaymentStatus = OrderPaymentStatus.PAID
	
		// Handle the events
		switch (event.type) {
			case 'checkout.session.completed': {
				break;
			}
			case 'payment_intent.payment_failed': {
				orderStatus = OrderPaymentStatus.FAILED
				break;
			}
			case 'checkout.session.expired': {
				orderStatus = OrderPaymentStatus.EXPIRED
				break;
			}
			default:
				// Unexpected event type
				isUnhandledEvent = true
				console.log(`Unhandled event type ${event.type}.`);
		}
	
		if (isUnhandledEvent === false) {

			await Order.updateMany({ checkoutSessionId: event.data.object.id }, { paymentStatus: orderStatus })

			const orders = await Order.find({ checkoutSessionId: event.data.object.id })

			if (orderStatus !== OrderPaymentStatus.PAID)
				orders.forEach(async order => {
					await Book.findByIdAndUpdate(order.product.original, { $inc: { stockCount: order.product.quantity } })
				})
			
			if (orderStatus === OrderPaymentStatus.PAID)
				await Cart.updateOne({ owner: orders[0].customer }, { $set: { items: [] } })
		}
	
		res.status(OK)
		
	} catch (error) {
		console.log(error)
		next(error)
	}

}
