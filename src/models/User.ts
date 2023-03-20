import { Schema, model, Types } from "mongoose";
import { IAddress } from "./Address";
import { IBook } from "./Book";

export interface IUser {
    _id?: Types.ObjectId
    username: string
    firstname: string
    lastname: string
    imgPath: string
    password?: string
    googleId?: number
    phone?: string
    email: string
    address?: IAddress
    books?: IBook[]
    stripeCustomerId?: string
}


const UserSchema = new Schema<IUser>({

    username: { type: String },

    firstname: { type: String },

    lastname: { type: String },

    imgPath: { type: String },

    password: { type: String, select: false },

    googleId: { type: Number },

    phone: { type: String },

    email: { type: String },

    address: { type: Schema.Types.ObjectId, ref: 'Address' },

    books: [{ type: Schema.Types.ObjectId, ref: 'Book' }],

    stripeCustomerId: { type: String, default: null, select: false },

} )

export default model<IUser>('User', UserSchema)
