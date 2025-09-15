import { reviewController } from "../../controllers/review.controller";
import { reviewService } from "../../services/review.service";
import { Request, Response } from "express";
import { ReviewDocument } from "../../models";

jest.mock("../../services/review.service");

describe("ReviewController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  let consoleErrSpy: jest.SpyInstance;
  beforeAll(() => {
    consoleErrSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterAll(() => {
    consoleErrSpy.mockRestore();
  });

  describe("create", () => {
    it("should create a review", async () => {
      const payload = {
        bookId: "book123",
        userId: "user789",
        rating: 5,
        comment: "ok",
      };
      const mockReview = { _id: "rev1", ...payload } as Partial<ReviewDocument>;
      req.body = payload;

      (reviewService.create as jest.Mock).mockResolvedValue(mockReview);

      await reviewController.create(req as Request, res as Response);

      expect(reviewService.create).toHaveBeenCalledWith(payload);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockReview);
    });

    it("create: 400 when bookId/userId missing", async () => {
      req.body = { comment: "ok", rating: 5 }; // faltan ids
      await reviewController.create(req as any, res as any);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("getById", () => {
    it("should return a review", async () => {
      const mockReview = { _id: "rev1" };
      req.params = { id: "rev1" };

      (reviewService.findById as jest.Mock).mockResolvedValue(mockReview);

      await reviewController.getById(req as Request, res as Response);

      expect(reviewService.findById).toHaveBeenCalledWith("rev1");
      expect(res.json).toHaveBeenCalledWith(mockReview);
    });

    it("should return 404 if not found", async () => {
      req.params = { id: "rev1" };
      (reviewService.findById as jest.Mock).mockResolvedValue(null);

      await reviewController.getById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Review not found" });
    });
  });

  describe("getByBook", () => {
    it("should return reviews by bookId", async () => {
      const mockReviews = [{ _id: "rev1" }];
      req.params = { bookId: "book123" };

      (reviewService.findByBook as jest.Mock).mockResolvedValue(mockReviews);

      await reviewController.getByBook(req as Request, res as Response);

      expect(reviewService.findByBook).toHaveBeenCalledWith("book123");
      expect(res.json).toHaveBeenCalledWith(mockReviews);
    });
  });

  describe("update", () => {
    it("should update a review", async () => {
      const updated = { _id: "rev1", rating: 4 };
      req.params = { id: "rev1" };
      req.body = { rating: 4 };

      (reviewService.update as jest.Mock).mockResolvedValue(updated);

      await reviewController.update(req as Request, res as Response);

      expect(reviewService.update).toHaveBeenCalledWith("rev1", { rating: 4 });
      expect(res.json).toHaveBeenCalledWith(updated);
    });

    it("should return 404 if not found", async () => {
      req.params = { id: "rev1" };
      req.body = { rating: 4 };

      (reviewService.update as jest.Mock).mockResolvedValue(null);

      await reviewController.update(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Review not found" });
    });
  });

  describe("delete", () => {
    it("should delete a review", async () => {
      req.params = { id: "rev1" };
      (reviewService.delete as jest.Mock).mockResolvedValue(true);

      await reviewController.delete(req as Request, res as Response);

      expect(reviewService.delete).toHaveBeenCalledWith("rev1");
      expect(res.json).toHaveBeenCalledWith({
        message: "Review deleted",
        id: "rev1",
      });
    });

    it("should return 404 if not found", async () => {
      req.params = { id: "rev1" };
      (reviewService.delete as jest.Mock).mockResolvedValue(null);

      await reviewController.delete(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Review not found" });
    });


    it("delete: 500 when service throws", async () => {
      req.params = { id: "rev1" };
      (reviewService.delete as jest.Mock).mockRejectedValue(new Error("oops"));
      await reviewController.delete(req as any, res as any);
      expect(res.status).toHaveBeenCalledWith(500);
    });

  });
});
