import express, { Request, Response} from 'express';
import { bookController } from '../controllers';

export const router = express.Router();

router.post('/',bookController.create);

router.get('/', bookController.getAll);

router.put('/:title', bookController.update);

router.delete('/:title', bookController.delete);