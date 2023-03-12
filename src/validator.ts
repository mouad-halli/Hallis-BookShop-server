import Joi from "joi"
import { bookGenres, bookLanguage } from "./models/Book"

const validator = (
    validationSchema: Joi.Schema,
    validationOptions: Joi.ValidationOptions
    ) => (payload) => {
        return validationSchema.validate(payload, validationOptions)
}

const signUpSchema = Joi.object({  
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(12).alphanum().required(),
    passwordConfirmation: Joi.ref('password')
})

const signInSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().alphanum().required(),
})

const updateUserSchema = Joi.object({
    firstname: Joi.string(),
    lastname: Joi.string(),
    username: Joi.string(),
    email: Joi.string(),
    password: Joi.string(),
    phone: Joi.number().integer(),
})

const createAddressSchema = Joi.object({
    street1: Joi.string().required(),
    street2: Joi.string().required(),
    country: Joi.string().required(),
    city: Joi.string().required(),
    zipCode: Joi.number().integer().positive().required()
})

const updateAddressSchema = Joi.object({
    street1: Joi.string(),
    street2: Joi.string(),
    country: Joi.string(),
    city: Joi.string(),
    zipCode: Joi.number().integer().positive()
})

const createBookSchema = Joi.object({
    name: Joi.string().required(),
    genre: Joi.string().valid(...Object.values(bookGenres)).required(),
    author: Joi.string().required(),
    year: Joi.number().integer().positive().max(new Date().getFullYear()).required(),
    bookLanguage: Joi.string().valid(...Object.values(bookLanguage)).required(),
    price: Joi.number().positive().required(),
    stockCount: Joi.number().integer().positive().required(),
    description: Joi.string(),
})

const updateBookSchema = Joi.object({
    name: Joi.string(),
    genre: Joi.string().valid(...Object.values(bookGenres)),
    author: Joi.string(),
    year: Joi.number().integer().positive().max(new Date().getFullYear()),
    bookLanguage: Joi.string().valid(...Object.values(bookLanguage)),
    price: Joi.number().positive(),
    stockCount: Joi.number().integer().positive(),
    description: Joi.string(),
})


export const validateSignUp = validator(signUpSchema, { abortEarly: true })

export const validateSignIn = validator(signInSchema, { abortEarly: true })

export const validateUpdateUser = validator(updateUserSchema, { abortEarly: true })

export const validateCreateAddress = validator(createAddressSchema, { abortEarly: true })

export const validateUpdateAddress = validator(updateAddressSchema, { abortEarly: true })

export const validatecreateBook = validator(createBookSchema, { abortEarly: true })

export const validateUpdateBook = validator(updateBookSchema, { abortEarly: true })