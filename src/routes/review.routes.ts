import express from "express";
import { reviewController } from "../controllers";

export const router = express.Router();

// Orden importante: rutas específicas antes de rutas con params variables
router.get("/book/:bookId", reviewController.getByBook);
router.post("/", reviewController.create);
router.get("/:id", reviewController.getById);
router.put("/:id", reviewController.update);
router.delete("/:id", reviewController.delete);
