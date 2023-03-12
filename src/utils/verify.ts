import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import { JWT_SECRET } from "../config/envConfig";
import { createError } from "./errors";

export const verifyToken = (req, res, next) => {
    // let token: string = req.headers.authorization
    const token = req.cookies.accessToken
    if (!token)
        return next(createError(401, 'Not Authanticated'))
    // token = token.split(' ')[1]
    
    jwt.verify(token, JWT_SECRET, async (err, payload) => {
        if (err)
            return next(createError(401, "Invalid Token"))
        const { id: userId } = payload
        const user: IUser = await User.findById(userId, '_id')
        if (!user)
            return next(createError(401, "User Not Found"))
        req.user = user
        next()
    })
}

export const verifyUser = (verifyToken, req, res, next) => {
    if (req.user.id === req.params.id || req.user.isAdmin === true)
        next()
    else
        return next(createError(StatusCodes.FORBIDDEN, 'Action Not Allowed'))
}

export const verifyAdmin = (verifyToken, req, res, next) => {
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