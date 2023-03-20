import { Schema, model, Types, ObjectId } from "mongoose";
import { IUser } from "./User";
import { IAddress } from "./Address";


export enum OrderStatus {
    FAILED = 'failed',
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    CANCELED = 'canceled',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    REFUNDED = 'refunded',
}

export interface IOrderItem {
    seller: IUser
    product: { _id: Types.ObjectId, name: String, imgPath: String, price: Number, quantity: Number }
    status: String
    trackingNumber?: Number
}

export interface IOrder {
    _id: Types.ObjectId
    customer: IUser
    products: IOrderItem[]
    status: String
    address: Omit<IAddress, 'user'>
}

const orderSchema = new Schema<IOrder>({

    customer: { type: Schema.Types.ObjectId, ref: 'User' },

    products: [{
        seller: { type: Schema.Types.ObjectId, ref: 'User' },

        product: { _id: Schema.Types.ObjectId, name: String, imgPath: String, price: Number, quantity: Number },

        status: { type: String, enum: OrderStatus, default: OrderStatus.PENDING },
        
        trackingNumber: { type: Number }
    }],

    address: {
        street1: String,

        street2: String,

        country: String,

        city: String,

        zipCode: String
    },

}, { timestamps: true })

export default model<IOrder>('Order', orderSchema)