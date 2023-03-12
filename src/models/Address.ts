import { Schema, model } from "mongoose"
import { IUser } from "./User"

export interface IAddress {
    user: IUser
    street1: String
    street2: String
    country: String
    city: String
    zipCode: Number
}

const addressSchema = new Schema<IAddress>({

    user: { type: Schema.Types.ObjectId, ref: 'User' },

    street1: { type: String, },

    street2: { type: String, },

    country: { type: String, },
    
    city: { type: String, },

    zipCode: { type: Number },

})

export default model<IAddress>('Address', addressSchema)