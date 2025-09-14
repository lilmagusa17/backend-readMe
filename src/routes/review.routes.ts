import express from "express";
import { reviewController } from "../controllers";
import { auth, authorize } from "../middlewares"; //auth JWT
import { Roles } from '../constants/rolesBurned';

export const router = express.Router();

// Orden importante: rutas específicas antes de rutas con params variables
router.get("/book/:bookId", auth, reviewController.getByBook);
router.post("/", auth, reviewController.create);
router.get("/:id", auth, reviewController.getById);
router.put("/:id", auth, reviewController.update);
router.delete("/:id", auth, reviewController.delete);
