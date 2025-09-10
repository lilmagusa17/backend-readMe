import {Request, Response} from 'express';
import { BookInput, BookInputUpdate } from "../interfaces";
import { BookDocument } from "../models";
import { bookService } from "../services";

class BookController{

    public async create(req: Request, res: Response){

        try{
            const newBook: BookDocument = await bookService.create(req.body as BookInput);
            res.status(201).json(newBook);
        }catch (error){
            if(error instanceof ReferenceError){
                res.status(400).json({message: 'Book already exists'});
                return;
            }
            console.log("AYUDA");
            console.log(error);
            res.status(500).json(error);
        }
        
    }

    public async getAll(req: Request, res: Response){
        try {
            const users: BookDocument[] = await bookService.findAll();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    public async delete(req: Request, res: Response){
        try {
            const title: string = req.params.title || '';
            const bookDeleted = await bookService.delete(title)
            res.status(200).json({bookDeleted, message: `Book with title ${title} deleted succesfully`})
        } catch (error) {
            if(error instanceof ReferenceError){
                res.status(400).json({message: "Book doesn't exists"});
                return;
            }
            res.status(500).json(error);
        }
    }

    public async update(req: Request, res: Response){
        
        try{
            const title: string = req.params.title || '';
            const book: BookDocument | null = await bookService.update(title, req.body as BookInputUpdate);
            if(book === null){
                res.status(404).json({message: `Book with title ${title} not found`});
                return;
            }
            res.json(book);
        }catch(error){
            console.log("AYUDA");
            res.status(500).json(error);
        }
    }


}

export const bookController = new BookController();