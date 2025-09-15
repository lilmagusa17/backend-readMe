import { reviewService } from "../../services/review.service";
import { ReviewModel, ReviewDocument } from "../../models/review.model";
import { ReviewInput } from "../../interfaces";

jest.mock("../../models/review.model", () => ({
  ReviewModel: {
    create: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

describe("ReviewService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a review", async () => {
      const mockInput: ReviewInput = {
        bookId: "book123",
        userId: "user123",
        rating: 5,
        title: "Amazing book",
        content: "Loved it",
      };

      const mockReview: Partial<ReviewDocument> = {
        ...mockInput,
        _id: "rev1",
      };

      (ReviewModel.create as jest.Mock).mockResolvedValue(mockReview);

      const result = await reviewService.create(mockInput);

      expect(ReviewModel.create).toHaveBeenCalledWith(mockInput);
      expect(result).toEqual(mockReview);
    });
  });

  describe("findById", () => {
    it("should return review by id", async () => {
      const mockReview = { _id: "rev1", rating: 4 };

      (ReviewModel.findById as jest.Mock).mockResolvedValue(mockReview);

      const result = await reviewService.findById("rev1");

      expect(ReviewModel.findById).toHaveBeenCalledWith("rev1");
      expect(result).toEqual(mockReview);
    });
  });

  describe("findByBook", () => {
    it("should return reviews by bookId", async () => {
      const mockReviews = [{ _id: "rev1" }, { _id: "rev2" }];

      // 🔧 Mock correcto para el query con .sort()
      (ReviewModel.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockReviews),
      });

      const result = await reviewService.findByBook("book123");

      expect(ReviewModel.find).toHaveBeenCalledWith({ bookId: "book123" });
      expect(result).toEqual(mockReviews);
    });
  });

  describe("update", () => {
    it("should update a review", async () => {
      const mockUpdated = { _id: "rev1", rating: 3 };

      (ReviewModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(
        mockUpdated
      );

      const result = await reviewService.update("rev1", { rating: 3 });

      expect(ReviewModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "rev1",
        { rating: 3 },
        { new: true }
      );
      expect(result).toEqual(mockUpdated);
    });
  });

  describe("delete", () => {
    it("should delete a review", async () => {
      const mockDeleted = { _id: "rev1" };

      (ReviewModel.findByIdAndDelete as jest.Mock).mockResolvedValue(
        mockDeleted
      );

      const result = await reviewService.delete("rev1");

      expect(ReviewModel.findByIdAndDelete).toHaveBeenCalledWith("rev1");
      expect(result).toEqual(mockDeleted);
    });
  });
});
