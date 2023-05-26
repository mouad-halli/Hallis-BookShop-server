import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import { JWT_SECRET } from "../config/envConfig";
import { createError } from "./errors";

export const verifyToken = (req: any, res: any, next: any) => {
    const token = req.cookies.accessToken
    if (!token)
        return next(createError(401, 'Not Authanticated'))

    
    jwt.verify(token, JWT_SECRET, async (err: any, payload: any) => {
        if (err)
            return next(createError(401, "Invalid Token"))
        const { id: userId } = payload
        const user = await User.findById(userId, '_id')
        if (!user)
            return next(createError(401, "User Not Found"))
        req.user = user
        next()
    })
}

export const verifyUser = (verifyToken: any, req: any, res: any, next: any) => {
    if (req.user.id === req.params.id || req.user.isAdmin === true)
        next()
    else
        return next(createError(StatusCodes.FORBIDDEN, 'Action Not Allowed'))
}

export const verifyAdmin = (verifyToken: any, req: any, res: any, next: any) => {
    if (req.user.isAdmin === true)
        next()
    else
        return next(createError(StatusCodes.FORBIDDEN, 'Only Admin is Allowed'))
}

// export const verifyUser = (req, res, next) => {
//     verifyToken(req, res, next, () => {
//         if (req.user.id === req.params.id || req.user.isAdmin === true)
//             next()
//         else
//             return next(createError(StatusCodes.FORBIDDEN, 'Action Not Allowed'))
//     })
// }

// export const verifyAdmin = (req, res, next) => {
//     verifyToken(req, res, next, () => {
//         if (req.user.isAdmin === true)
//             next()
//         else
//             return next(createError(StatusCodes.FORBIDDEN, 'Only Admin is Allowed'))
//     })
// }