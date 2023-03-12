import dotenv from 'dotenv'
dotenv.config()

const PORT: number = Number(process.env.PORT || 8000)

const DB_LINK: string = String(process.env.DB_LINK)

const JWT_SECRET: string = String(process.env.JWT_SECRET)
const JWT_EXPIRATION_H: string = String(process.env.JWT_EXPIRATION_H)
const JWT_EXPIRATION_D: string = String(process.env.JWT_EXPIRATION_D)

// Front end
const CLIENT_NAME: string = String(process.env.FRONT_END_NAME)
const CLIENT_PORT: string = String(process.env.FRONT_END_PORT)
// const CLIENT_URL: string = `http://${CLIENT_NAME}:${CLIENT_PORT}`
const CLIENT_URL: string = String(process.env.FRONT_END_URL)

// Back end
const SERVER_URL: string = String(process.env.BACK_END_URL)

const UPLOAD_LOCATION: string = String(process.env.UPLOAD_LOCATION)

//STRIPE
const STRIPE_SECRET_KEY: string = String(process.env.STRIPE_SECRET_KEY)
const STRIPE_WEBHOOK_ENDPOINT_SECRET: string = String(process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET)

//GOOGLE
const GOOGLE_CLIENT_ID: string = String(process.env.GOOGLE_CLIENT_ID)
const GOOGLE_CLIENT_SECRET: string = String(process.env.GOOGLE_CLIENT_SECRET)

export {
    PORT, DB_LINK,
    JWT_SECRET, JWT_EXPIRATION_H, JWT_EXPIRATION_D,
    CLIENT_NAME, CLIENT_PORT, CLIENT_URL, UPLOAD_LOCATION,
    SERVER_URL, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_ENDPOINT_SECRET,
    GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
}