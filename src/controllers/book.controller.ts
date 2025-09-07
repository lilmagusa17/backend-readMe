import {Request, Response} from 'express';
import { BookInput } from "../interfaces";
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
            res.status(500).json(error);
        }
        
    }

}

export const bookController = new BookController();