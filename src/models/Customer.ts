import { Schema, model, Types } from "mongoose";
import { IUser } from "./User";

export interface ICustomer {
    _id?: Types.ObjectId
    user: IUser
    stripeId: string
    paypalId: string
}

const costumerSchema = new Schema<ICustomer>({

    user: { type: Schema.Types.ObjectId, ref: 'User' },
    stripeId: { type: String, default: null },
    paypalId: { type: String, default: null }

})

export default model<ICustomer>('Customer', costumerSchema)