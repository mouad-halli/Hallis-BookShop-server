import { Router } from 'express'

import {
    updateUser, getAllUsers, getUserAddress, createUserAddress,
    me, updateUserAddress, deleteUserAddress, setUserImage, findAllUserWithBooks
} from '../controllers/user';

import { verifyAdmin, verifyToken } from '../utils/verify';
import multer from 'multer';
import { multerOptions } from '../config/multerConf';
import { validateBody } from '../controllers/validation';
import { validateCreateAddress, validateUpdateAddress, validateUpdateUser } from '../validator';

const upload = multer(multerOptions)

const router  = Router()

router.put('/', verifyToken, validateBody(validateUpdateUser), updateUser)

router.put('/set-img', verifyToken, upload.single('img'), setUserImage)

router.put('/address', verifyToken, validateBody(validateUpdateAddress), updateUserAddress)

router.delete('/address', verifyToken, deleteUserAddress)

router.post('/address', verifyToken, validateBody(validateCreateAddress), createUserAddress)

router.get('/me', verifyToken, me)

router.get('/address', verifyToken, getUserAddress)

router.get('/', verifyAdmin, getAllUsers)

router.get('/users-books/:min_books', findAllUserWithBooks)

export default router