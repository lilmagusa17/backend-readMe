import express, { Request, Response} from 'express';
import { userController } from '../controllers';

export const router = express.Router();
//usuarios 'normales', lectores (rol default)
router.post("/register", (req, res) => userController.register(req, res));
//usuarios admin (se pone el rol)
router.post("/", (req, res) => userController.create(req, res));

router.get("/", (req, res) => userController.getAll(req, res));

//El update y el delete lo estoy manejando x email
router.put("/:email", (req, res) => userController.update(req, res));

router.delete("/:email", (req, res) => userController.delete(req, res));
