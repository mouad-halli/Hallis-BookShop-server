import { STRIPE_SECRET_KEY, SERVER_URL, STRIPE_WEBHOOK_ENDPOINT_SECRET } from '../config/envConfig'
import Stripe from 'stripe'
import { NextFunction, Response } from 'express';
import Cart, {ICartItem, ICart} from '../models/Cart';
import { IGetUserAuthInfoRequest } from '../config/typesConf';
import { StatusCodes } from 'http-status-codes';
import Order from '../models/Order';
import { createError } from '../utils/errors';
import Customer from '../models/Customer';

const { ACCEPTED } = StatusCodes
// with the CLI, find the secret by running 'stripe listen'
const endpointSecret = STRIPE_WEBHOOK_ENDPOINT_SECRET

const stripePayment = new Stripe(STRIPE_SECRET_KEY, {apiVersion: '2022-11-15'})

export const stripeCheckout = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
        const cart: ICart = await Cart.findOne({owner: req.user._id}, '-_id -items._id').populate<{items: ICartItem[]}>([
			{ path: 'items.product', select: 'name price imgPath' },
			{ path: 'owner', select: 'firstname lastname', populate: { path: 'address' } },
		])

		if (!cart)
			return next(createError(404, `couldn't find user shopping Cart`))

		const order = new Order({
			customer: req.user._id,
			items: cart.items,
			address: cart.owner.address
		})
		
		let customerProfile = await Customer.findOne({user: req.user._id})

		if (!customerProfile) {
			const userAddress = cart.owner.address
			const customer = await stripePayment.customers.create({
				shipping: {
					address: {
						city: String(userAddress.city),
						country: String(userAddress.country),
						line1: String(userAddress.street1),
						line2: String(userAddress.street2),
						postal_code: String(userAddress.zipCode),
	
					},
					name: String(`${req.body.firstname} ${req.body.lastname}`),
					phone: String(cart.owner.phone)
				}
			})
			customerProfile = await new Customer({
				user: req.user._id,
				stripeId: customer.id
			}).save()
		}
		await order.save()
        const session = await stripePayment.checkout.sessions.create({
			line_items: cart.items.map(item => {
				return {
					price_data: {
						currency: 'usd',
						product_data: {
							name: item.product.name,
							images: [`${SERVER_URL}/${item.product.imgPath}`]
						},
						unit_amount: Number(item.product.price * 100)
					},
					quantity: item.quantity
				}
			}),
			customer: customerProfile.stripeId,
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `${SERVER_URL}/payment?success=true`,
            cancel_url: `${SERVER_URL}?canceled=true`,
			client_reference_id: String(order._id)
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
			event = stripePayment.webhooks.constructEvent(
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
