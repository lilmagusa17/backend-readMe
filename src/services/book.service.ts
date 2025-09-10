import { BookInput, BookInputUpdate } from "../interfaces";
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

    public async findAll(): Promise<BookDocument[]> {
        
        try{
            return BookModel.find({});
        }catch(error){
            throw error;
        }
    }

    public async delete(title: string){
        try {
            const bookExists: BookDocument | null = await this.findByTitle(title);
            if (bookExists === (null)){
                throw new ReferenceError("Book doesn't exists");
            }
            return BookModel.deleteOne({title: title});

        } catch (error) {
            throw error;
        }
    }

    public async update(title: string, bookInput: BookInputUpdate){
        try{
            const bookExists: BookDocument | null = await this.findByTitle(title);
            if (bookExists === (null)){
                console.log("noooo");
                throw new ReferenceError("Book doesn't exists");
            }
            const book: BookDocument | null = await BookModel.findOneAndUpdate({title: title}, bookInput, {returnOriginal: false});
            
            //console.log(book);
            return book;
        }catch(error){
            throw error;
        }
    }

}

export const bookService = new BookService();