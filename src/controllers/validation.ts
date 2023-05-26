import { NextFunction, Request, Response } from "express";
import { createError } from "../utils/errors";
import httpCodes from "http-status-codes";

const { BAD_REQUEST } = httpCodes

export const validateBody = (validator: any) => {

    return (req: Request, res: Response, next: NextFunction) => {

        const { error } = validator(req.body)

        if (error)
            next(createError(BAD_REQUEST, error.details[0].message))
        next()
    }

}
