import { Router } from 'express';

import {
    findBook, createBook, updateBook, deleteBook, findUserBooks,
    deleteAll, findLastAddedBooks, searchBooks, findAuthorBooks,
    findBooksByGenre, findBooksByLanguage, findSellerBooks, findSellers,
    setBookImage,
} from '../controllers/book';

import multer from 'multer';
import { multerOptions } from '../config/multerConf';
import { verifyToken } from '../utils/verify';
import { validateBody } from '../controllers/validation';
import { validatecreateBook, validateUpdateBook } from '../validator';

const upload = multer(multerOptions)
const router  = Router()

router.get("/listed", verifyToken, findUserBooks)

router.get('/last-added/:limit', findLastAddedBooks)

router.get('/by-language', findBooksByLanguage)

router.get('/by-genre', findBooksByGenre)

router.get('/by-author', findAuthorBooks)

router.get('/seller-books/:sellerId', findSellerBooks)

router.get('/search', searchBooks)

router.get('/:id', findBook)

router.get('/sellers/:limit', findSellers)

router.post('/', verifyToken, validateBody(validatecreateBook), createBook)

router.put('/:id', verifyToken, validateBody(validateUpdateBook), updateBook)

router.put('/set-img/:id', verifyToken, upload.single('img'), setBookImage)

router.delete('/', deleteAll)

router.delete('/:id', verifyToken, deleteBook)

export default router