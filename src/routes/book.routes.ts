import express, { Request, Response} from 'express';
import { bookController } from '../controllers';
import { auth, authorize } from "../middlewares"; //auth JWT
import { Roles } from '../constants/rolesBurned';

export const router = express.Router();

router.post('/', auth, authorize(Roles.ADMIN), bookController.create);

router.get('/', auth, bookController.getAll);

router.put('/:title', auth, authorize(Roles.ADMIN), bookController.update);

router.delete('/:title', auth, authorize(Roles.ADMIN), bookController.delete);