import express from 'express'
import { CLIENT_URL, PORT, UPLOAD_LOCATION } from './config/envConfig'
import { connectToDatabase } from './config/databaseConf'
import authRoute from './routes/auth'
import userRoute from './routes/user'
import bookRoute from './routes/book'
import cartRoute from './routes/cart'
import payment from './routes/payment'
import order from './routes/order'

import { StatusCodes } from 'http-status-codes'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import passport from 'passport'

const app = express()

app.use(cors({
	origin: CLIENT_URL,
	credentials: true
}))

app.use(cookieParser())

app.use(passport.initialize())

app.get('/uploads/:file', (req, res) => {
	res.sendFile(req.params.file, {root: UPLOAD_LOCATION})
})

app.get('/api', (req, res) => {
	res.status(200).json('welcom')
})

app.use('/payment', payment)

app.use(express.json())

app.use('/auth', authRoute)
app.use('/user', userRoute)
app.use('/book', bookRoute)
app.use('/cart', cartRoute)
app.use('/order', order)

app.use((error, req, res, next) => {
	const errorStatus = error.status || 500
	const errorMessage = error.message || StatusCodes.INTERNAL_SERVER_ERROR

	return res.status(errorStatus).json({
		message: errorMessage,
	})
})

app.listen(PORT, () => {
	console.log(`server listening on port ${PORT}`)
	connectToDatabase()
})