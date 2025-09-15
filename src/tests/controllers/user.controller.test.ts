import { userController } from "../../controllers/user.controller";
import { userService } from "../../services/user.service";
import { Request, Response } from "express";
import { UserDocument } from "../../models";
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


  describe("register", () => {
    it("should register a user with role READER", async () => {
      const mockUserInput: UserInput = {
        username: "New User",
        email: "new@example.com",
        password: "password123",
        role: Roles.READER,
      };

      const mockUser: Partial<UserDocument> = {
        _id: "abc123",
        username: "New User",
        email: "new@example.com",
        role: Roles.READER,
      };

      req.body = mockUserInput;
      (userService.create as jest.Mock).mockResolvedValue(mockUser);

      await userController.register(req as Request, res as Response);

      expect(userService.create).toHaveBeenCalledWith(mockUserInput, false);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it("should return 400 if ReferenceError is thrown", async () => {
      req.body = { username: "fail" } as UserInput;
      const error = new ReferenceError("User already exists");
      (userService.create as jest.Mock).mockRejectedValue(error);

      await userController.register(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "User already exists" });
    });
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

    it("should return 400 if user already exists", async () => {
      req.body = { username: "John Doe" } as UserInput;
      const error = new ReferenceError("User already exists");
      (userService.create as jest.Mock).mockRejectedValue(error);

      await userController.create(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "User already exists" });
    });
  });


  describe("login", () => {
    it("should return a token on valid login", async () => {
      req.body = { email: "john@example.com", password: "123456" };
      (userService.login as jest.Mock).mockResolvedValue("fakeToken");

      await userController.login(req as Request, res as Response);

      expect(userService.login).toHaveBeenCalledWith(
        "john@example.com",
        "123456"
      );
      expect(res.json).toHaveBeenCalledWith({ token: "fakeToken" });
    });

    it("should return 401 on invalid credentials", async () => {
      req.body = { email: "john@example.com", password: "wrong" };
      (userService.login as jest.Mock).mockRejectedValue(
        new ReferenceError("Invalid credentials")
      );

      await userController.login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
    });
  });

 
  describe("getAll", () => {
    it("should return all users", async () => {
      const mockUsers: Partial<UserDocument>[] = [
        {
          _id: "1",
          username: "John",
          email: "john@example.com",
          role: Roles.READER,
        },
        {
          _id: "2",
          username: "Jane",
          email: "jane@example.com",
          role: Roles.ADMIN,
        },
      ];

      (userService.findAll as jest.Mock).mockResolvedValue(mockUsers);

      await userController.getAll(req as Request, res as Response);

      expect(userService.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it("should return 500 on error", async () => {
      (userService.findAll as jest.Mock).mockRejectedValue(
        new Error("DB error")
      );

      await userController.getAll(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getOne", () => {
    it("should return a user by email", async () => {
      const mockUser: Partial<UserDocument> = {
        _id: "123",
        username: "John Doe",
        email: "john.doe@example.com",
        role: Roles.READER,
      };

      req.params = { email: "john.doe@example.com" };
      (userService.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      await userController.getOne(req as Request, res as Response);

      expect(userService.findByEmail).toHaveBeenCalledWith(
        "john.doe@example.com"
      );
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it("should return 400 if no email param is provided", async () => {
      req.params = {};
      await userController.getOne(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "User email is required",
      });
    });

    it("should return 404 if user not found", async () => {
      req.params = { email: "missing@example.com" };
      (userService.findByEmail as jest.Mock).mockResolvedValue(null);

      await userController.getOne(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });
  });


  describe("update", () => {
    it("should update a user and return the updated user", async () => {
      const mockUserUpdate: UserInputUpdate = {
        username: "Updated username",
        email: "updated@example.com",
      };

      const mockUpdatedUser: Partial<UserDocument> = {
        _id: "12345",
        username: "Updated username",
        email: "updated@example.com",
        role: Roles.READER,
      };

      req.params = { id: "12345" };
      req.body = mockUserUpdate;
      (req as any).user = { role: Roles.ADMIN };
      (userService.update as jest.Mock).mockResolvedValue(mockUpdatedUser);

      await userController.update(req as Request, res as Response);

      expect(userService.update).toHaveBeenCalledWith(
        "12345",
        mockUserUpdate,
        Roles.ADMIN
      );
      expect(res.json).toHaveBeenCalledWith(mockUpdatedUser);
    });

    it("should return 404 if user is not found", async () => {
      req.params = { id: "12345" };
      req.body = { username: "Update fail" };
      (req as any).user = { role: Roles.ADMIN };
      (userService.update as jest.Mock).mockResolvedValue(null);

      await userController.update(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
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
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });
  });

    describe("update - validations & errors", () => {
      it("should return 400 if no id is provided on update", async () => {
        req.params = {};
        await userController.update(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          message: "User id is required",
        });
      });

      it("should return 500 if service throws on update", async () => {
        req.params = { id: "12345" };
        req.body = { username: "X" };
        (req as any).user = { role: Roles.ADMIN };
        (userService.update as jest.Mock).mockRejectedValue(
          new Error("DB error")
        );

        await userController.update(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "DB error" });
      });
    });

    describe("delete - validations & errors", () => {
      it("should return 400 if no id is provided on delete", async () => {
        req.params = {};
        await userController.delete(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          message: "User id is required",
        });
      });

      it("should return 500 if service throws on delete", async () => {
        req.params = { id: "12345" };
        (userService.delete as jest.Mock).mockRejectedValue(new Error("boom"));

        await userController.delete(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(new Error("boom"));
      });
    });

    describe("register/getOne - unexpected errors", () => {
      it("register: should return 500 on unexpected error", async () => {
        req.body = {
          username: "A",
          email: "a@a.com",
          password: "z",
          role: Roles.READER,
        };
        (userService.create as jest.Mock).mockRejectedValue(
          new Error("unexpected")
        );
        await userController.register(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(500);
      });

      it("getOne: should return 500 on service error", async () => {
        req.params = { email: "x@x.com" };
        (userService.findByEmail as jest.Mock).mockRejectedValue(
          new Error("DB down")
        );
        await userController.getOne(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(500);
      });
    });

});
