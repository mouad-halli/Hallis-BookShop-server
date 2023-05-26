import { NextFunction, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { HydratedDocument, Schema, Types, isValidObjectId } from "mongoose"
import { IGetUserAuthInfoRequest } from "../config/typesConf"
import Book, { IBook } from "../models/Book"
import Cart, { ICart, ICartItem } from "../models/Cart"
import { createError } from '../utils/errors'

const { OK, BAD_REQUEST } = StatusCodes

export const findCartItems = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
        const userId: Types.ObjectId = req.user._id
        // let subTotal: number = 0
        let items:any[] = []

        // const cart: ICart = await Cart.findOne({owner: userId}, '-_id -items._id').populate<{items: ICartItem[]}>({
        //     path: 'items.product', select: 'price'
        // })
        const cart: ICart = await Cart.findOne({owner: userId}, '-_id -items._id')

        if (cart) {
            items = cart.items.map(item => {
                return { productId: item.product._id, quantity: item.quantity }
            })
            // items = items.map(cartItem => {
            //     console.log(cartItem)
            //     subTotal += (cartItem.product.price * cartItem.quantity)
            //     return {
            //         _id: cartItem._id,
            //         quantity: cartItem.quantity,
            //         productId: cartItem.product._id}
            // })
        }
        res.status(OK).json(items)
    } catch (error) {
        next(error)
    }
}

export const findCartItemsWithProducts = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
        const userId: Types.ObjectId = req.user._id
        let subTotal: number = 0
        let cartItems: any[] = []

        let cart: ICart = await Cart.findOne({owner: userId}, '-_id items').populate<{items: ICartItem[]}>({
            path: 'items',
            populate: {
                path: 'product', select: 'name imgPath price stockCount'
            }

        })
        
        if (cart) {
            // const foundNull = cart.items.findIndex(item => !item.product)
            // if (foundNull > -1) {
            //     cart.items = cart.items.filter(cartItem => cartItem.product != null)
            //     await Cart.updateOne({_id: cart._id}, { $set: cart })
            // }
            cart.items.forEach(cartItem => subTotal += (cartItem.product.price * cartItem.quantity))
            cartItems = cart.items
        }
        res.status(OK).json({cartItems , subTotal})
    } catch (error) {
        next(error)
    }
}

export const addProduct = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user._id
        const productId: string = req.params.productId

        if (!productId || !isValidObjectId(productId))
            return next(createError(BAD_REQUEST, 'invalid book id'))

        // getting the product
        const product: IBook = await Book.findOne({ _id: productId })

        if (!product)
            return next(createError('404', "product not found"))
    
        // getting user cart
        const cart: ICart = await Cart.findOne({ owner: userId }).populate<{items: ICartItem[]}>('items.product', 'price')

        // if user already have a cart
        if (cart) {
            // checking if the product is already in the cart

            let itemIndex: number = cart.items.findIndex(item => String(item.product._id) === String(product._id))
            // if so then increase its quantity
            if (itemIndex > -1)
                await Cart.updateOne(
                    {_id: cart._id, 'items.product': productId},
                    { $inc: {"items.$.quantity": 1} }
                )
            else
                await Cart.updateOne({_id: cart._id}, { $push: {items: {$each: [{product, quantity: 1}]}} })
        }
        // if user doesn't have a cart
        else {
            // creating a cart
            const newCart: HydratedDocument<ICart> = new Cart({
                owner: userId,
                items: [{ product, quantity: 1}]
            })
            await newCart.save()
        }
        res.status(OK).json('product added successfully')

    } catch (error) {
        next(error)
    }
}

export const removeProduct = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {

        const userId: Types.ObjectId = req.user._id
        const productId: string = req.params.productId

        // getting the product
        const product: IBook = await Book.findOne({ _id: productId })
        if (!product)
            return next(createError('404', "product not found"))
    
        // getting user cart
        const cart: ICart = await Cart.findOne({ owner: userId }).populate<{items: ICartItem[]}>('items.product', 'price')
        if (!cart)
            return next(createError('404', "user doesn't have a cart"))
        
        //searching product inside the user cart
        const itemIndex: number = cart.items.findIndex(item => String(item.product._id) === String(product._id))
        if (itemIndex < 0)
            return next(createError(404, "couldn't find product in user Cart"))

        // if product quantity will be 0 we remove it from the cart
        if (cart.items[itemIndex].quantity > 1)
            // cart.items[itemIndex].quantity -= 1
            await Cart.updateOne(
                {_id: cart._id, 'items.product': productId},
                { $inc: {"items.$.quantity": -1} }
            )
        else
            // cart.items.splice(itemIndex, 1)
            await Cart.updateOne({_id: cart._id}, { $pull: { 'items': { 'product': productId } } })
        // await Cart.findByIdAndUpdate(cart._id, { $set: cart }/*, { new: true }*/)
        res.status(OK).json('product removed succesffuly')
        
    } catch (error) {
        next(error)
    }
}

export const deleteProduct = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
        const userId: Types.ObjectId = req.user._id
        const productId: string = req.params.productId

        const cart: ICart = await Cart.findOne({ owner: userId }).populate<{items: ICartItem[]}>('items.product', '_id')
        if (!cart)
            return next(createError('404', "user doesn't have a cart"))

        const itemIndex: number = cart.items.findIndex(item => String(item.product._id) === String(productId))
        if (itemIndex < 0)
            return next(createError(404, "couldn't find product in user Cart"))

        cart.items.splice(itemIndex, 1)
        await Cart.findByIdAndUpdate(cart._id, { $set: cart }/*, { new: true }*/)
        
        res.status(OK).json('product removed succesffuly')
        
    } catch (error) {
        next(error)
    }
}
