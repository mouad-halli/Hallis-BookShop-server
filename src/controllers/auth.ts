import { StatusCodes } from 'http-status-codes'
import User from '../models/User'
import bcryptjs from 'bcryptjs'
import { createError } from '../utils/errors'
import { JWT_SECRET, JWT_EXPIRATION_H, CLIENT_URL } from '../config/envConfig'
import jwt from 'jsonwebtoken'
import { Schema, Types } from 'mongoose'
import '../validator'
const { OK, CREATED, BAD_REQUEST, PERMANENT_REDIRECT } = StatusCodes

import { validateSignUp, validateSignIn } from '../validator'
import { IGetUserAuthInfoRequest, IGetUserGoogleInfoRequest } from '../config/typesConf'
import { NextFunction, Response } from 'express'

export const register = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {

    try {

        const newUser = new User({
            username: req.body.username,
            email: req.body.email
        })

        const duplicateUser = await User.findOne({
            $or: [{ username: newUser.username }, { email: newUser.email }]
        })

        if (duplicateUser) {
            if (duplicateUser.username === newUser.username)
                return next(createError(BAD_REQUEST, "this username is already in use"))
            if (duplicateUser.email === newUser.email)
                return next(createError(BAD_REQUEST, "this email is already in use"))
        }
        
        if (req.body.password !== req.body.passwordConfirmation)
            return next(createError(BAD_REQUEST, "password and confirm password must be identical"))

        const salt = await bcryptjs.genSalt(10)
        const hash = await bcryptjs.hash(req.body.password, salt)

        newUser.password = hash

        await newUser.save()
        res.status(CREATED).json("User registered succesfully")

    } catch(error) {
        next(error)
    }
}

export const login = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {

        const user: any = await User.findOne({username: req.body.username})

        if (!user || !user.password)
            return next(createError(BAD_REQUEST, "Wrong password or username"))

        const isPasswordCorrect = await bcryptjs.compare(req.body.password, user.password)

        if (!isPasswordCorrect)
            return next(createError(BAD_REQUEST, "Wrong password or username"))
        
        const payload = {
            id: user.id,
            isAdmin: user.isAdmin
        }

        const token = jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION_H }
        )

        const {username, email, imgPath, isAdmin} = user._doc

        res.status(OK)
        .cookie('accessToken', token, { httpOnly: true })
        .json({username, email, imgPath, isAdmin, token})

    } catch(error) {
        next(error)
    }
}

export const googleAuth = async (req: IGetUserGoogleInfoRequest, res: Response, next: NextFunction) => {
    try {

        let user = await User.findOne({googleId: req.user.id})

        if (!user) {
            user = new User({
                googleId: req.user.id,
                firstname: req.user.name.familyName,
                lastname: req.user.name.givenName,
                contactInfo: { email: req.user.email },
                imgPath: req.user.fullPicture,
            })
            user = await user.save()
        }

        const payload = {
            id: user._id,
        }

        const token = jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION_H }
        )

        res.status(OK)
        .cookie('accessToken', token, { httpOnly: true })
        .redirect(PERMANENT_REDIRECT, CLIENT_URL)

    } catch (error) {
        next(error)
    }
}