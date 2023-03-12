import { Request } from "express"
import { IUser } from '../models/User'

interface googleUser {
    id: string
    name: { familyName: string, givenName: string }
    email: string,
    fullPicture: string,
}

export interface IGetUserAuthInfoRequest extends Request {
	user: IUser
}

export interface IGetUserGoogleInfoRequest extends Request {
	user: googleUser
}
