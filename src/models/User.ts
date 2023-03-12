import { Schema, model, Types } from "mongoose";
import { IAddress } from "./Address";
import { IBook } from "./Book";

export interface IUser {
    _id?: Types.ObjectId
    username: string
    firstname: String
    lastname: String
    imgPath: string
    password?: string
    googleId?: number
    phone?: number
    email: string
    address?: IAddress
    books?: IBook[]
}


const UserSchema = new Schema<IUser>({

    username: { type: String },

    firstname: { type: String },

    lastname: { type: String },

    imgPath: { type: String },

    password: { type: String },

    googleId: { type: Number },

    phone: { type: Number },

    email: { type: String },

    address: { type: Schema.Types.ObjectId, ref: 'Address' },

    books: [{ type: Schema.Types.ObjectId, ref: 'Book' }],

} )

export default model<IUser>('User', UserSchema)
