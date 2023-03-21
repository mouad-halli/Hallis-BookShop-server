import { NextFunction, Response } from "express";
import { IGetUserAuthInfoRequest } from "../config/typesConf";
import Order, { OrderPaymentStatus, OrderStatus } from "../models/Order";
import { StatusCodes } from "http-status-codes";
import { createError } from "../utils/errors";
import { isValidObjectId } from "mongoose";

const { OK, BAD_REQUEST, FORBIDDEN, NOT_FOUND } = StatusCodes


export const getUserBuyOrders = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
        const orders = await Order.find({customer: req.user._id}, "-customer -checkoutSessionId").populate('seller', '-_id imgPath firstname lastname')

        res.status(OK).json(orders)
    } catch (error) {
        next(error)
    }
}

export const getUserSellOrders = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
        const orders = await Order.find({seller: req.user._id}, "-seller -checkoutSessionId").populate('customer', '-_id imgPath firstname lastname phone email')

        res.status(OK).json(orders)
    } catch (error) {
        next(error)
    }
}

export const setOrderItemStatusShipped = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
        const orderProductId = req.params.orderProductId

        if (!orderProductId || !isValidObjectId(orderProductId))
            next(createError(BAD_REQUEST, 'please provide a valid order_product_id'))

        const { matchedCount } =  await Order.updateOne(
            {
                _id: orderProductId,
                paymentStatus: OrderPaymentStatus.PAID,
                seller: req.user._id,
                status: OrderStatus.PENDING 
            },
            { $set: { 'products.$.status': OrderStatus.SHIPPED } }
        )
        
        if (!matchedCount)
            return next(createError(BAD_REQUEST, 'failed'))
        
        res.status(OK).json('success')

    } catch (error) {
        next(error)
    }
}

export const setOrderItemStatusDelivered = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
        const orderProductId = req.params.orderProductId

        if (!orderProductId || !isValidObjectId(orderProductId))
            next(createError(BAD_REQUEST, 'please provide a valid order_product_id'))

        const { matchedCount } = await Order.updateOne(
            {
                _id: orderProductId,
                paymentStatus: OrderPaymentStatus.PAID,
                seller: req.user._id,
                status: OrderStatus.SHIPPED
            },
            { $set: { 'products.$.status': OrderStatus.DELIVERED } }
        )

        if (!matchedCount)
            return next(createError(BAD_REQUEST, 'failed'))
        
        res.status(OK).json('success')

    } catch (error) {
        next(error)
    }
}

export const setOrderItemStatusCanceled = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
        const orderProductId = req.params.orderProductId

        if (!orderProductId || !isValidObjectId(orderProductId))
            next(createError(BAD_REQUEST, 'please provide a valid order_product_id'))

        const { matchedCount } = await Order.updateOne(
            {
                _id: orderProductId,
                paymentStatus: OrderPaymentStatus.PAID,
                seller: req.user._id,
                status: { $in: [ OrderStatus.PENDING, OrderStatus.SHIPPED ] }
            },
            { $set: { 'products.$.status': OrderStatus.CANCELED } }
        )

        if (!matchedCount)
            return next(createError(BAD_REQUEST, 'failed'))
        
        res.status(OK).json('success')

    } catch (error) {
        next(error)
    }
}

export const setOrderItemStatusPicked = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
        const orderProductId = req.params.orderProductId

        if (!orderProductId || !isValidObjectId(orderProductId))
            next(createError(BAD_REQUEST, 'please provide a valid order_product_id'))

        const { matchedCount } = await Order.updateOne(
            {
                _id: orderProductId,
                paymentStatus: OrderPaymentStatus.PAID,
                customer: req.user._id,
                productsstatus: OrderStatus.DELIVERED
            },
            { $set: { 'products.$.status': OrderStatus.PICKED } }
        )

        if (!matchedCount)
            return next(createError(BAD_REQUEST, 'failed'))
        
        res.status(OK).json('success')

    } catch (error) {
        next(error)
    }
}