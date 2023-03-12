import { Schema, model, Types } from "mongoose";
import { IBook } from "./Book";
import { IUser } from "./User";

export interface ICartItem {
    _id?: Types.ObjectId
    product: IBook
    quantity: number
}

export interface ICart {
    _id?: Types.ObjectId
    owner: IUser
    items: ICartItem[]
}

export const cartItemScema = new Schema<ICartItem>({

    product: { type: Schema.Types.ObjectId, ref: 'Book' },

    quantity: { type: Number, required: true, default: 0, min: [1, 'quantity cannot be less than 1.'] },

}, /*{ timestamps: true }*/)

const cartSchema = new Schema<ICart>({

    owner: { type: Schema.Types.ObjectId, ref: 'User' },

    items: [cartItemScema],

}/*, { timestamps: true }*/)

export default model<ICart>('Cart', cartSchema)