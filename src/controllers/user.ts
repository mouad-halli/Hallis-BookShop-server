import { Request, Response, NextFunction } from 'express';
import { IGetUserAuthInfoRequest } from '../config/typesConf';
import User from '../models/User'
import { StatusCodes } from 'http-status-codes';
import { createError } from '../utils/errors';
import bcryptjs from 'bcryptjs'
import Address from '../models/Address';
import { SERVER_URL } from '../config/envConfig'

const { OK, CREATED, BAD_REQUEST, NOT_FOUND } = StatusCodes

export const me = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {

        const me = await User.findById(req.user._id, "-__v -googleId -books")

        if (!me)
            res.status(createError(NOT_FOUND, "user not found"))

        res.status(OK).json(me)

    } catch (error) {
        next(error)
    }
}

export const createUserAddress = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {

    try {

        let userAddress = await Address.findOne({user: req.user._id})
    
        if (userAddress)
            return next(createError(BAD_REQUEST, 'user already have an address'))
        
        userAddress = await new Address({
            user: req.user._id,
            street1: req.body.street1,
            street2: req.body.street2,
            country: req.body.country,
            city: req.body.city,
            zipCode: req.body.zipCode
        }).save().then(async (address) => {
            await User.updateOne({_id: req.user._id}, { address: address })
            return address
        })
    
        res.status(CREATED).json(userAddress)
        
    } catch (error) {
    	next(error)
    }

}

export const getUserAddress = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {

    try {

        const userAddress = await Address.findOne({user: req.user._id}, "-_id -__v -user")
    
        // if (!userAddress)
        //     return next(createError(NOT_FOUND, 'user address not found'))
    
        res.status(OK).json(userAddress)
        
    } catch (error) {
    	next(error)
    }

}

export const updateUserAddress = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {

        await Address.findOneAndUpdate({user: req.user._id}, {
            $set: req.body
        })

        res.status(CREATED).json(req.body)
        
    } catch (error) {
        next(error)
    }
}

export const deleteUserAddress = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {

        await Address.findOneAndDelete({user: req.user._id})

        res.status(OK).json('deleted successfully')
        
    } catch (error) {
        next(error)
    }
}

export const updateUser = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {

        if (req.body.username) {
            if (await User.findOne({$and: [{username: req.body.username}, {_id: {$ne: req.user._id}}]}))
                return next(createError(BAD_REQUEST, "this username is already in use"))
        }
        if (req.body.password) {
            const salt = await bcryptjs.genSalt(10)
            const hash = await bcryptjs.hash(req.body.password, salt)
            req.body.password = hash
        }


        if (req.body.email) {
            if (await User.findOne({$and: [{email: req.body.email}, {_id: {$ne: req.user._id}}]}))
                return next(createError(BAD_REQUEST, "this email is already in use"))
        }

        if (req.body) {
            await User.findByIdAndUpdate(
                req.user._id,
                { $set: req.body },
                // { new: true, fields: { password: 0 } }
                { new: true }
            )
        }

        const {password, ...responseData} = req.body

		res.status(CREATED).json(responseData)

    } catch(error) {
    	next(error)
    }
}

export const setUserImage = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {

    try {

        if (!req.file)
            return next(createError(BAD_REQUEST, 'please provide an image'))

        const imgPath: string = `${SERVER_URL}/${req.file.path}`

        await User.findOneAndUpdate({_id: req.user._id}, {imgPath: imgPath})

        res.status(CREATED).json(imgPath)

    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
	try {

        await User.findByIdAndDelete(req.params.id)
        res.status(OK).json("User deleted succesfully")

    } catch(error) {
        next(error)
    }
}

export const getUser = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
	try {

        const user = await User.findById(req.params.id)
        res.status(OK).json(user)

    } catch(error) {
		next(error)
    }
}

export const getAllUsers = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
	try {
        const users = await User.find()
        res.status(OK).json(users)

    } catch(error) {
        next(error)
    }
}

export const findAllUserWithBooks = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {

        const minBooks = Number(req.params.min_books) || 6

        const users = await User.find(
            {$expr:{$gte:[{$size:"$books"}, minBooks]}},
            { firstname: 1, lastname: 1, username: 1, imgPath: 1, books: 1 }
        ).populate({ path: 'books', match: { archived: false }, select: 'imgPath' })

        res.status(OK).json(users.filter(user => user.books.length > 0))

    } catch (error) {
        next(error)
    }
}
