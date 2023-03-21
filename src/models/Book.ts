import mongoose, { PopulatedDoc, Schema, Types } from "mongoose";
import User, { IUser } from "./User";
import Cart from "./Cart";

export enum bookGenres {
    ADVENTURE_STORIES = "Adventure stories",
    CLASSICS = "Classics",
    CRIME = "Crime",
    FAIRY_TALES = "Fairy tales",
    FANTASY = "Fantasy",
    HISTORICAL_FICTION = "Historical fiction",
    HORROR = "Horror",
    HUMOUR_AND_SATIRE = "Humour and satire",
    LITERARY_FICTION = "Literary fiction",
    MYSTERY = "Mystery",
    POETRY = "Poetry",
    PLAYS = "Plays",
    ROMANCE = "Romance",
    SCIENCE_FICTION = "Science fiction",
    SHORT_STORIES = "Short stories",
    THRILLERS = "Thrillers",
    WAR = "War",
    WOMEN_FICTION = "Women’s fiction",
    YOUNG_ADULT = "Young adult",
    AUTOBIOGRAPHY_AND_MEMOIR = "Autobiography and memoir",
    BIOGRAPHY = "Biography",
    ESSAYS = "Essays",
    NON_FICTION_NOVEL = "Non-fiction novel",
    SELFT_HELP = "Self-help"
}

export enum bookLanguage {
    ENGLISH = "English",
    FRENCH = "French",
    ARABIC = "Arabic"
}

export interface IBook {
    _id?: Types.ObjectId
    name: string
    author: string
    seller: IUser
    stockCount: number
    price: number
    genre: String
    year: number
    bookLanguage: string
    description: string
    imgPath: string
    archived: boolean
}

const bookSchema = new Schema<IBook>({

    name: { type: String, required: true },

    imgPath: { type: String, default: null },

    author: { type: String, required: true },

    seller: { type: Schema.Types.ObjectId, ref: 'User' },

    stockCount: { type: Number, default: 0 },

    price: { type: Number, required: true },

    genre: { type: String, enum: bookGenres, required: true },

    year: { type: Number, default: new Date().getFullYear() },

    bookLanguage: { type: String, enum: bookLanguage, required: true },

    description: { type: String, default: '' },

    archived: { type: Boolean, default: false, select: false }

}, /*{ timestamps: true }*/)

bookSchema.index({name: 'text', author: 'text', genre: 'text'})

// Cascade Delete
bookSchema.post("findOneAndDelete", async function(doc, next) {

    await User.findOneAndUpdate({ books: { $in: [doc._id] } }, { $pull: { books: doc._id } })
    
    await Cart.updateMany({"items.product": doc._id}, { $pull: { items: { "product._id": doc._id } } })

    next()
})

export default mongoose.model<IBook>("Book", bookSchema)