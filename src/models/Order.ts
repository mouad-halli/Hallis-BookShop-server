import { Schema, model, Types } from "mongoose";
import { IUser } from "./User";
import { ICartItem, cartItemScema } from "./Cart";
import { IAddress } from "./Address";


export enum paymentStatus {
    SUCCEED = 'succeed',
    FAILED = 'failed',
    PENDING = 'pending',
    REFUNDED = 'refunded'
}

export interface IOrder {
    _id: Types.ObjectId
    customer: IUser
    items: ICartItem[]
    paymentStatus: String
    address: IAddress
    trackingNumber: Number
}

const orderSchema = new Schema<IOrder>({

    customer: { type: Schema.Types.ObjectId, ref: 'User' },

    items: [cartItemScema],
    
    paymentStatus: { type: String, enum: paymentStatus, default: paymentStatus.PENDING },

    address: { type: Schema.Types.ObjectId, ref: 'Address' },

    trackingNumber: { type: Number, default: null }

}, { timestamps: true })

export default model<IOrder>('Order', orderSchema)