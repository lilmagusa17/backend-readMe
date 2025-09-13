import express, { Request, Response} from 'express';
import { userController } from '../controllers';
import { auth, authorize } from "../middlewares"; // autenticación JWT
import { Roles } from '../constants/rolesBurned';

export const router = express.Router();
//usuarios 'normales', lectores (rol default)
router.post("/register", (req, res) => userController.register(req, res));
//usuarios admin (se pone el rol)
router.post("/", auth, authorize(Roles.ADMIN), (req, res) => userController.create(req, res));

router.post("/login", (req, res) => userController.login(req, res));

router.get("/", auth, authorize(Roles.ADMIN), (req, res) => userController.getAll(req, res));

//El update y el delete lo estoy manejando x ids
router.put("/:id", auth, (req, res) => userController.update(req, res));
router.delete("/:id", auth, authorize(Roles.ADMIN), (req, res) => userController.delete(req, res));
