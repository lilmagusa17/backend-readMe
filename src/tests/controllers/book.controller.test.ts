import { bookController } from "../../controllers/book.controller";
import { bookService } from "../../services/book.service";
import { Request, Response } from "express";
import { BookDocument } from "../../models";

jest.mock("../../services/book.service");

describe("BookController", () => {
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

  describe("create", () => {
    it("should create a book and return 201", async () => {
      const mockBook = { title: "Clean Code" } as Partial<BookDocument>;
      req.body = mockBook;

      (bookService.create as jest.Mock).mockResolvedValue(mockBook);

      await bookController.create(req as Request, res as Response);

      expect(bookService.create).toHaveBeenCalledWith(mockBook);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockBook);
    });

    it("should return 400 if book already exists", async () => {
      req.body = { title: "Clean Code" };
      (bookService.create as jest.Mock).mockRejectedValue(
        new ReferenceError("Book already exists")
      );

      await bookController.create(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Book already exists" });
    });
  });

  describe("getAll", () => {
    it("should return all books", async () => {
      const mockBooks = [{ title: "Book1" }, { title: "Book2" }];
      (bookService.findAll as jest.Mock).mockResolvedValue(mockBooks);

      await bookController.getAll(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockBooks);
    });
  });

  describe("delete", () => {
    it("should delete a book", async () => {
      req.params = { title: "Clean Code" };
      (bookService.delete as jest.Mock).mockResolvedValue(true);

      await bookController.delete(req as Request, res as Response);

      expect(bookService.delete).toHaveBeenCalledWith("Clean Code");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        bookDeleted: true,
        message: "Book with title Clean Code deleted succesfully",
      });
    });

    it("should return 400 if book does not exist", async () => {
      req.params = { title: "Unknown" };
      (bookService.delete as jest.Mock).mockRejectedValue(
        new ReferenceError("Book doesn't exists")
      );

      await bookController.delete(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Book doesn't exists" });
    });
  });

  describe("update", () => {
    it("should update a book", async () => {
      req.params = { title: "Clean Code" };
      req.body = { publisher: "Pearson" };

      const updatedBook = { title: "Clean Code", publisher: "Pearson" };
      (bookService.update as jest.Mock).mockResolvedValue(updatedBook);

      await bookController.update(req as Request, res as Response);

      expect(bookService.update).toHaveBeenCalledWith("Clean Code", {
        publisher: "Pearson",
      });
      expect(res.json).toHaveBeenCalledWith(updatedBook);
    });

    it("should return 404 if book not found", async () => {
      req.params = { title: "Unknown" };
      req.body = {};

      (bookService.update as jest.Mock).mockResolvedValue(null);

      await bookController.update(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Book with title Unknown not found",
      });
    });

    it("create: 400 when missing required fields", async () => {
      req.body = {}; // falta title/author/etc según tus validaciones
      await bookController.create(req as any, res as any);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("update: 500 when service throws", async () => {
      req.params = { id: "book123" };
      req.body = { title: "New" };
      (bookService.update as jest.Mock).mockRejectedValue(new Error("boom"));
      await bookController.update(req as any, res as any);
      expect(res.status).toHaveBeenCalledWith(500);
    });

  });
});
