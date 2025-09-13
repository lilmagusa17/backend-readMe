import { Request, Response } from "express";
import { ReviewInput } from "../interfaces";
import { ReviewDocument } from "../models";
import { reviewService } from "../services";

class ReviewController {
  public async create(req: Request, res: Response) {
    try {
      const payload = req.body as ReviewInput;
      const newReview: ReviewDocument = await reviewService.create(payload);
      res.status(201).json(newReview);
    } catch (error) {
      console.error("Error create review:", error);
      res.status(500).json({ message: "Error creating review", error });
    }
  }

  public async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const review = await reviewService.findById(id as string);
      if (!review) return res.status(404).json({ message: "Review not found" });
      res.json(review);
    } catch (error) {
      console.error("Error get review:", error);
      res.status(500).json(error);
    }
  }

  public async getByBook(req: Request, res: Response) {
    try {
      const { bookId } = req.params;
      const reviews = await reviewService.findByBook(bookId as string);
      res.json(reviews);
    } catch (error) {
      console.error("Error get reviews by book:", error);
      res.status(500).json(error);
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const payload = req.body as Partial<ReviewInput>;
      const updated = await reviewService.update(id as string, payload);
      if (!updated)
        return res.status(404).json({ message: "Review not found" });
      res.json(updated);
    } catch (error) {
      console.error("Error update review:", error);
      res.status(500).json(error);
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await reviewService.delete(id as string);
      if (!deleted)
        return res.status(404).json({ message: "Review not found" });
      res.json({ message: "Review deleted", id });
    } catch (error) {
      console.error("Error delete review:", error);
      res.status(500).json(error);
    }
  }
}

export const reviewController = new ReviewController();
