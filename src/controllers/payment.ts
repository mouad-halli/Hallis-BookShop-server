import { STRIPE_SECRET_KEY, SERVER_URL, STRIPE_WEBHOOK_ENDPOINT_SECRET, CLIENT_URL } from '../config/envConfig'
import Stripe from 'stripe'
import { NextFunction, Response } from 'express';
import Cart, {ICartItem, ICart} from '../models/Cart';
import { IGetUserAuthInfoRequest } from '../config/typesConf';
import { StatusCodes } from 'http-status-codes';
import Order, { IOrder, IOrderItem, OrderStatus } from '../models/Order';
import { createError } from '../utils/errors';
import User from '../models/User';
import Book from '../models/Book';

const { ACCEPTED } = StatusCodes
// with the CLI, find the secret by running 'stripe listen'
const endpointSecret = STRIPE_WEBHOOK_ENDPOINT_SECRET

const stripe = new Stripe(STRIPE_SECRET_KEY, {apiVersion: '2022-11-15'})

export const stripeCheckout = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
        const cart: ICart = await Cart.findOne({owner: req.user._id}, '-_id -items._id').populate<{items: ICartItem[]}>([
			{ path: 'items.product', select: 'name price imgPath, stockCount' },
			{ path: 'owner', select: 'firstname lastname phone stripeCustomerId', populate: { path: 'address', select: '-_id -user' } },
		])

		if (!cart)
			return next(createError(404, `couldn't find user Cart`))

		if (!cart.owner.address)
			return next(createError(404, `please fill your address`))
		
		if (!cart.owner.firstname || !cart.owner.lastname)
			return next(createError(404, `please fill you firstname and lastname`))

		if (!cart.owner.phone)
			return next(createError(404, `please fill you phone number`))

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

		const { user, ...customerAddress } = cart.owner.address

		const order = new Order({
			customer: cart.owner,
			address: customerAddress
		})

		let line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = cart.items.map(item => {

			const { quantity } = item

			const { _id, name, imgPath, price } = item.product


			order.products.push({
				seller: item.product.seller,
				product: { _id, name, imgPath, price, quantity: quantity },
				status: OrderStatus.PENDING
			})

			return {
				price_data: {
					currency: 'usd',
					product_data: {
						name: name,
						images: [imgPath]
					},
					unit_amount: Number(price * 100)
				},
				quantity: quantity
			}
		})

		await order.save()

		cart.items.forEach(async(item) => {
			await Book.findByIdAndUpdate(item.product._id, { $set: { stockCount: item.product.stockCount - item.quantity } })
		})

        const session = await stripe.checkout.sessions.create({
			line_items: line_items,
			customer: customerId,
            payment_method_types: ['card'],
            mode: 'payment',
            // success_url: SERVER_URL + "/payment/success?session_id={CHECKOUT_SESSION_ID}",
            success_url: CLIENT_URL,
            cancel_url: CLIENT_URL,
        })

        res.status(ACCEPTED).json( session.url )

    } catch (error) {
        next(error)
    }
}

export const stripeWebHook = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
	console.log('webhook trigered')
	let event = req.body;
	// Only verify the event if you have an endpoint secret defined.
	// Otherwise use the basic event deserialized with JSON.parse
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
		  return res.sendStatus(400)
		}
	}

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
		// const paymentIntent = event.data.object
		const orderId = event.data.object.client_reference_id
		console.log(`PaymentIntent for ${event.data.object.amount} was successful!`);
		// Then define and call a method to handle the successful payment intent.
		// handlePaymentIntentSucceeded(paymentIntent);

		/*
			TO DO:
				- loop trough
		*/

		// await Cart.updateOne({ owner: req.user._id }, { $set: { items: [] } })

		break;
    case 'payment_intent.payment_failed':
        // const paymentIntent = event.data.object
    //   const paymentMethod = event.data.object;
    //   // Then define and call a method to handle the successful attachment of a PaymentMethod.
    //   // handlePaymentMethodAttached(paymentMethod);
      break;
    default:
      // Unexpected event type
      console.log('client is ', event.type.client_reference_id)
      console.log(`Unhandled event type ${event.type}.`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
}
