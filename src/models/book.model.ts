import mongoose, { mongo, Mongoose } from "mongoose";
import { BookInput } from "../interfaces";

//Se crean los atributos de BookInput mas esos 3
export interface BookDocument extends BookInput, mongoose.Document{
    createdAt: Date,
    updateAt: Date,
    deleteAt: Date
}

const bookSchema = new mongoose.Schema({
    title: {type: String, required: true, index: true},
    authors: [{type: String}],
    publisher: {type: String},
    publishedDate: {type: Date},
    categories: [{type: String}]
},{timestamps: true, collection: "books"})

export const BookModel = mongoose.model<BookDocument>('Book', bookSchema);