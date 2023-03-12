import { NextFunction, Response } from "express";
import { IGetUserAuthInfoRequest } from "../config/typesConf";
import Order from "../models/Order";

export const getUserOrders = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const orders = await Order.find({customer: req.user._id}, '-address').populate('items.product')
    res.status(200).json(orders)
}