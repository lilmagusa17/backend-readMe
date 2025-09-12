import { ReviewInput } from "../interfaces";
import { ReviewDocument, ReviewModel } from "../models";

class ReviewService {
  public async create(reviewInput: ReviewInput): Promise<ReviewDocument> {
    return ReviewModel.create(reviewInput);
  }

  public async findById(id: string): Promise<ReviewDocument | null> {
    return ReviewModel.findById(id);
  }

  public async findByBook(bookId: string): Promise<ReviewDocument[]> {
    return ReviewModel.find({ bookId }).sort({ createdAt: -1 });
  }

  public async update(
    id: string,
    payload: Partial<ReviewInput>
  ): Promise<ReviewDocument | null> {
    return ReviewModel.findByIdAndUpdate(id, payload, { new: true });
  }

  public async delete(id: string): Promise<ReviewDocument | null> {
    // Borrado físico. Si prefieres soft-delete, modifica aquí.
    return ReviewModel.findByIdAndDelete(id);
  }
}

export const reviewService = new ReviewService();
