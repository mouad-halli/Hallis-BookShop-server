import { StatusCodes } from "http-status-codes";
import { createError } from "../utils/errors"
import Book, { IBook, bookLanguage } from "../models/Book";
import { deleteFileIfExist, renameFile } from "../utils/files";
import User from "../models/User";
import { isValidObjectId } from "mongoose";
import { validateUpdateBook, validatecreateBook } from "../validator";
import { NextFunction, Request, Response } from "express";
import { IGetUserAuthInfoRequest } from "../config/typesConf";
import { SERVER_URL } from "../config/envConfig";
import Cart from "../models/Cart";

const { OK, CREATED, BAD_REQUEST, NOT_FOUND } = StatusCodes

export const findSellers = async (req: Request, res: Response, next: NextFunction) => {
    const booksLimit = req.params.limit
    try {
        const sellersIds = await Book.find().distinct('seller')
        // const sellersBooks = sellersIds.map(async (sellerId) => {
        //     const books = await Book.find({seller: sellerId}).limit(booksLimit)
        //     if (!books)
        //         return
        //     return {sellerId, books}
        // })
        // const data = await Promise.all(sellersBooks)
        // res.status(OK).json(data)
        res.status(OK).json(sellersIds)

    } catch (error) {
        next(error)
    }
}

export const findSellerBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const seller = await User.findOne({_id: req.params.sellerId})
        if (!seller)
            next(createError(NOT_FOUND, 'seller not found'))
        const limit = Number(req.params.limit) || 4
        const books = await Book.find({seller: seller}).limit(limit).limit(6).populate('seller', 'imgPath username')
        
        res.status(OK).json(books)
    } catch (error) {
        next(error)
    }
}

export const findBooksByLanguage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const books = await Book.find({bookLanguage: req.query.q, archived: false})
        res.status(OK).json(books)
    } catch (error) {
        next(error)
    }
}

export const findBooksByGenre = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const books = await Book.find({genre: req.query.q, archived: false})
        res.status(OK).json(books)
    } catch (error) {
        next(error)
    }
}

export const findAuthorBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const books = await Book.find({author: req.query.q, archived: false})
        res.status(OK).json(books)
    } catch (error) {
        next(error)
    }
}

export const searchBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const searchQuery = String(req.query.q)
        const searchResult = await Book.find({archived: false, $text: { $search: searchQuery, $caseSensitive: false } }, "-__v").populate({ path: 'seller', select: '_id' })
        res.status(OK).json(searchResult)
    } catch (error) {
        next(error)
    }
}

export const findLastAddedBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const limit: number = Number(req.params.limit) || 5
        const books = await Book.find({ archived: false }).sort([['_id', -1]]).select({ _id: 1, imgPath: 1, name: 1, author: 1, price: 1, genre: 1, description: 1 }).limit(limit)
        res.status(OK).json(books)
    } catch (error) {
        next(error)
    }
}

export const findBook = async (req: Request, res: Response, next: NextFunction) => {
	try {
        const bookId = req.params.id

        if (!isValidObjectId(bookId))
            return next(createError(400, "invalid book id"))

        if (!bookId)
            return next(createError(400, "please enter the Book id"))

        const book = await Book.findOne({ _id: bookId, archived: false }).populate({path: 'seller', select: 'username firstname lastname books', populate: {path: 'books', select: 'imgPath'}})

        if (!book)
            return next(createError(404, "book not found"))

        if (book.seller.books && book.seller.books?.length > 4)
            book.seller.books = book.seller.books.slice(0, 4)

        res.status(OK).json(book)

    } catch(error) {
		next(error)
    }
}

export const findAllBooks = async (req: Request, res: Response, next: NextFunction) => {
	try {

        const books = await Book.find({ archived: false })
        
        res.status(OK).json(books)

    } catch(error) {
		next(error)
    }
}

export const findUserBooks = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
        const books = await Book.find({'seller': req.user._id, archived: false}, '-__v')
        res.status(OK).json(books)
    } catch(error) {
        next(error)
    }
}

export const createBook = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {

    const newBook = new Book({
        ...req.body,
        seller: req.user._id,
    })

    await newBook.save()
    .then(async (book: IBook) => {
        await User.findByIdAndUpdate(req.user._id, { $push: { books: book._id } })
    })

    res.status(CREATED).json(newBook._id)
}

export const updateBook = async (req: Request, res: Response, next: NextFunction) => {

    const bookId = req.params.id

    if (!bookId || !isValidObjectId(bookId))
        return next(createError(BAD_REQUEST, "invalid book id"))
    

    const updatedBook = await Book.findOneAndUpdate(
        { _id: bookId, archived: false},
        { $set: req.body },
        { new: true })

    res.status(CREATED).json(updatedBook)
}

export const setBookImage = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const bookId = req.params.id

        if (!bookId || !isValidObjectId(bookId))
            return next(createError(BAD_REQUEST, "invalid book id"))

        if (!req.file)
            return next(createError(BAD_REQUEST, "please upload an image"))

        const imgPath = `${SERVER_URL}/${req.file.path}`

        await Book.findOneAndUpdate( {_id: bookId, archived: false }, {imgPath: imgPath})

        res.status(CREATED).json(imgPath)

    } catch (error) {
        next(error)
    }
}

export const deleteBook = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {

        const bookId = req.params.id

        if (!bookId || !isValidObjectId(bookId))
            return next(createError(400, "invalid book id"))

        await Cart.updateMany({"items.product": bookId}, { $pull: { items: { 'product': bookId } } })

        // const bookImgFileName = await Book.findOneAndDelete({_id: bookId, seller: req.user._id}).then( async (book: IBook) => {
        //     return book.imgPath.split('/').at(-1)
        // })
        await Book.findOneAndUpdate({ _id: bookId, seller: req.user._id }, { archived: true })

        // deleteFileIfExist(bookImgFileName)

        res.status(OK).json("Book deleted succesfully")

    } catch(error) {
        next(error)
    }
}

export const deleteAll = async (req: Request, res: Response, next: NextFunction) => {
    await Book.deleteMany()
    res.status(OK).json('all books has been deleted')
}