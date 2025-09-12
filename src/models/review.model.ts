import mongoose from "mongoose";
import { ReviewInput } from "../interfaces";

export interface ReviewDocument extends ReviewInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String },
    content: { type: String },
  },
  { timestamps: true, collection: "reviews" }
);

export const ReviewModel = mongoose.model<ReviewDocument>(
  "Review",
  reviewSchema
);
