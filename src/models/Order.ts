import { Schema, model, Types } from "mongoose";
import { IAddress } from "./Address";
import { IUser } from "./User";
import { IBook } from "./Book";

export enum OrderPaymentStatus {
    PENDING = 'pending',
    EXPIRED = 'expired',
    FAILED = 'failed',
    PAID = 'paid',
}

export enum OrderStatus {
    PENDING = 'pending',
    CANCELED = 'canceled',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    PICKED = 'picked',
    REFUNDED = 'refunded',
}

export interface OrderProduct extends Pick<IBook,  'name' | 'imgPath' | 'price'> {
    original: IBook
    quantity: number
}

export interface IOrder {
    _id: Types.ObjectId
    seller: IUser
    customer: IUser
    product: OrderProduct
    status: OrderStatus
    paymentStatus: OrderPaymentStatus
    trackingNumber?: String
    checkoutSessionId: String
    address: Omit<IAddress, 'user'>
}

const orderSchema = new Schema<IOrder>({

    seller: { type: Schema.Types.ObjectId, ref: 'User' },

    customer: { type: Schema.Types.ObjectId, ref: 'User' },

    product: {
        original: { type: Schema.Types.ObjectId, ref: 'Book' },
        name: String,
        imgPath: String,
        price: Number,
        quantity: Number,
    },

    status: { type: String, enum: OrderStatus, default: OrderStatus.PENDING },

    paymentStatus: { type: String, enum: OrderPaymentStatus, default: OrderPaymentStatus.PENDING },

    trackingNumber: { type: Number },

    checkoutSessionId: { type: String, select: false },

    address: { street1: String, street2: String, country: String, city: String, zipCode: String },

}, { timestamps: true })

export default model<IOrder>('Order', orderSchema)