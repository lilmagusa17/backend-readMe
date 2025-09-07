import { BookInput } from "../interfaces";
import { BookDocument, BookModel } from "../models";

class BookService{

    public async create(bookInput: BookInput): Promise<BookDocument>{
        const bookExists: BookDocument | null = await this.findByTitle(bookInput.title); //TODO no se si esto deberia ser by title y publisher
        if (bookExists !== (null)){
            throw new ReferenceError('Book already exists');
        }
            
        return BookModel.create(bookInput);
    }

    public findByTitle(title: string): Promise<BookDocument | null>{
        return BookModel.findOne({ title });
    }

}

export const bookService = new BookService();