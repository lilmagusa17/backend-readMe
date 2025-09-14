import { userController } from "../../controllers/user.controller";
import { userService } from "../../services/user.service";
import { Request, Response } from "express";
import { UserDocument} from "../../models";
import { UserInput, UserInputUpdate } from "../../interfaces";
import { Roles } from "../../constants/rolesBurned";

jest.mock("../../services/user.service", () => ({
  userService: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByEmail: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    login: jest.fn(),
  },
}));

describe("UserController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a new user and return 201", async () => {
      const mockUserInput: UserInput = {
        username: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
        role: Roles.READER,
      };

      const mockUser: Partial<UserDocument> = {
        _id: "12345",
        username: "John Doe",
        email: "john.doe@example.com",
        role: Roles.READER,
      };


      req.body = mockUserInput;
      (userService.create as jest.Mock).mockResolvedValue(mockUser);

      await userController.create(req as Request, res as Response);

      expect(userService.create).toHaveBeenCalledWith(mockUserInput, true);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it("should call next with an error if user already exists", async () => {
      const mockUserInput: UserInput = {
        username: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
        role: Roles.READER,
      };

      req.body = mockUserInput;
      const error = new ReferenceError("User already exists");
      (userService.create as jest.Mock).mockRejectedValue(error);

      await userController.create(req as Request, res as Response);

      expect(userService.create).toHaveBeenCalledWith(mockUserInput);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("getAll", () => {
    it("should return all users", async () => {
      const mockUsers: Partial<UserDocument>[] = [
        {
          _id: "1",
          username: "John Doe",
          email: "john@example.com",
          role:  Roles.READER,
        },
        {
          _id: "2",
          username: "Jane Doe",
          email: "jane@example.com",
          role: Roles.ADMIN,
        },
      ];

      (userService.findAll as jest.Mock).mockResolvedValue(mockUsers);

      await userController.getAll(req as Request, res as Response);

      expect(userService.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });
  });

  describe("getOne", () => {
    it("should return a user by email", async () => {
     const mockUser: Partial<UserDocument> = {
       _id: "12345",
       username: "John Doe",
       email: "john.doe@example.com",
       role: Roles.READER,
     };

      req.params = { email: "john.doe@example.com" };
      (userService.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      await userController.getOne(req as Request, res as Response);

      expect(userService.findByEmail).toHaveBeenCalledWith("john.doe@example.com");
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it("should return 404 if user is not found", async () => {
      req.params = { email: "john@example.com" };
      (userService.findByEmail as jest.Mock).mockResolvedValue(null);

      await userController.getOne(req as Request, res as Response);

      expect(userService.findByEmail).toHaveBeenCalledWith("john@example.com");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "User with email john@example.com not found",
      });
    });
  });

  describe("update", () => {
    it("should update a user and return the updated user", async () => {
      const mockUserUpdate: UserInputUpdate = {
        username: "Updated username",
        email: "email.updated@gmail.com",
      };
    
      const mockUpdatedUser: Partial<UserDocument> = {
        _id: "12345",
        username: "John DoeS",
        email: "john2@example.com",
        role: Roles.READER,
      };
    
      req.params = { id: "12345" };
      req.body = mockUserUpdate;
      (userService.update as jest.Mock).mockResolvedValue(mockUpdatedUser);

      await userController.update(req as Request, res as Response);

      expect(userService.update).toHaveBeenCalledWith("12345", mockUserUpdate);
      expect(res.json).toHaveBeenCalledWith(mockUpdatedUser);
    });

    it("should return 404 if user is not found", async () => {
      req.params = { id: "12345" };
      req.body = { username: "Updated username" };
      (userService.update as jest.Mock).mockResolvedValue(null);

      await userController.update(req as Request, res as Response);

      expect(userService.update).toHaveBeenCalledWith("12345", {
        username: "Updated Name",
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "User with id 12345 not found",
      });
    });
  });

  describe("delete", () => {
    it("should delete a user and return 204", async () => {
      req.params = { id: "12345" };
      (userService.delete as jest.Mock).mockResolvedValue(true);

      await userController.delete(req as Request, res as Response);

      expect(userService.delete).toHaveBeenCalledWith("12345");
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("should return 404 if user is not found", async () => {
      req.params = { id: "12345" };
      (userService.delete as jest.Mock).mockResolvedValue(false);

      await userController.delete(req as Request, res as Response);

      expect(userService.delete).toHaveBeenCalledWith("12345");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "User with id 12345 not found",
      });
    });
  });
});
