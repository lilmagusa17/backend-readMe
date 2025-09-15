import { bookService } from "../../services/book.service";
import { BookModel, BookDocument } from "../../models";
import { BookInput, BookInputUpdate } from "../../interfaces";

jest.mock("../../models", () => ({
  BookModel: {
    create: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    deleteOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  },
}));

describe("BookService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a new book", async () => {
      const mockBookInput: BookInput = {
        title: "Clean Code",
        authors: ["Robert C. Martin"],
        publisher: "Prentice Hall",
        publishedDate: new Date("2008-08-01"),
        categories: ["Programming"],
      };

      const mockBook: Partial<BookDocument> = {
        ...mockBookInput,
        _id: "123",
        createdAt: new Date(),
        updateAt: new Date(),
        deleteAt: new Date(),
      };

      (BookModel.findOne as jest.Mock).mockResolvedValue(null);
      (BookModel.create as jest.Mock).mockResolvedValue(mockBook);

      const result = await bookService.create(mockBookInput);

      expect(BookModel.findOne).toHaveBeenCalledWith({
        title: mockBookInput.title,
      });
      expect(BookModel.create).toHaveBeenCalledWith(mockBookInput);
      expect(result).toEqual(mockBook);
    });

    it("should throw an error if book already exists", async () => {
      const mockBookInput: BookInput = {
        title: "Clean Code",
        authors: ["Robert C. Martin"],
        publisher: "Prentice Hall",
        publishedDate: new Date("2008-08-01"),
        categories: ["Programming"],
      };

      (BookModel.findOne as jest.Mock).mockResolvedValue(mockBookInput);

      await expect(bookService.create(mockBookInput)).rejects.toThrow(
        "Book already exists"
      );
    });
  });

  describe("findAll", () => {
    it("should return all books", async () => {
      const mockBooks = [{ title: "Book1" }, { title: "Book2" }];
      (BookModel.find as jest.Mock).mockResolvedValue(mockBooks);

      const result = await bookService.findAll();

      expect(BookModel.find).toHaveBeenCalledWith({});
      expect(result).toEqual(mockBooks);
    });
  });

  describe("delete", () => {
    it("should delete a book if exists", async () => {
      (BookModel.findOne as jest.Mock).mockResolvedValue({ title: "Book1" });
      (BookModel.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 1 });

      const result = await bookService.delete("Book1");

      expect(BookModel.findOne).toHaveBeenCalledWith({ title: "Book1" });
      expect(BookModel.deleteOne).toHaveBeenCalledWith({ title: "Book1" });
      expect(result).toEqual({ deletedCount: 1 });
    });

    it("should throw an error if book does not exist", async () => {
      (BookModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(bookService.delete("Unknown")).rejects.toThrow(
        "Book doesn't exists"
      );
    });
  });

  describe("update", () => {
    it("should update a book if it exists", async () => {
      const mockUpdate: BookInputUpdate = {
        authors: ["Uncle Bob"],
        publisher: "Pearson",
        publishedDate: new Date("2009-01-01"),
        categories: ["Software"],
      };

      const mockBook: Partial<BookDocument> = {
        title: "Clean Code",
        ...mockUpdate,
      };

      (BookModel.findOne as jest.Mock).mockResolvedValue({
        title: "Clean Code",
      });
      (BookModel.findOneAndUpdate as jest.Mock).mockResolvedValue(mockBook);

      const result = await bookService.update("Clean Code", mockUpdate);

      expect(BookModel.findOne).toHaveBeenCalledWith({ title: "Clean Code" });
      expect(BookModel.findOneAndUpdate).toHaveBeenCalledWith(
        { title: "Clean Code" },
        mockUpdate,
        { returnOriginal: false }
      );
      expect(result).toEqual(mockBook);
    });

    it("should throw an error if book does not exist", async () => {
      (BookModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        bookService.update("Unknown", {} as BookInputUpdate)
      ).rejects.toThrow("Book doesn't exists");
    });
  });
});
