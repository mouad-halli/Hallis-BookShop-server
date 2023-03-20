import { Schema, model } from "mongoose"
import { IUser } from "./User"

export interface IAddress {
    user: IUser
    street1: string
    street2: string
    country: string
    city: string
    zipCode: string
}

const addressSchema = new Schema<IAddress>({

    user: { type: Schema.Types.ObjectId, ref: 'User' },

    street1: { type: String, },

    street2: { type: String, },

    country: { type: String, },
    
    city: { type: String, },

    zipCode: { type: String },

})

export default model<IAddress>('Address', addressSchema)