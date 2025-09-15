
jest.mock("../../models/user.model", () => ({
  UserModel: {
    create: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

import { userService } from "../../services";
import { UserModel, UserDocument } from "../../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserInput } from "../../interfaces";
import { Roles } from "../../constants/rolesBurned";

describe("UserService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const mockUserInput: UserInput = {
        username: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
        role: Roles.READER,
      };

      const plainPassword = mockUserInput.password!;
      const mockHashedPassword = "hashedPassword123";
      const mockCreatedUser: Partial<UserDocument> = {
        ...mockUserInput,
        password: mockHashedPassword,
        _id: "12345",
        role: Roles.READER,
      };

      // orden de llamadas en create:
      // 1) findOne({ email })  -> null
      // 2) findOne({ username }) -> null
      (UserModel.findOne as jest.Mock)
        .mockResolvedValueOnce(null) // email no existe
        .mockResolvedValueOnce(null); // username no existe

      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);
      (UserModel.create as jest.Mock).mockResolvedValue(mockCreatedUser);

      const result = await userService.create(mockUserInput, true);

      expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, 10);
      expect(UserModel.create).toHaveBeenCalledWith({
        ...mockUserInput,
        password: mockHashedPassword,
      });
      expect(result).toEqual(mockCreatedUser);
    });

    it("should throw if email already exists", async () => {
      const mockUserInput: UserInput = {
        username: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
        role: Roles.READER,
      };

      // 1) findOne({ email }) -> usuario existente
      (UserModel.findOne as jest.Mock).mockResolvedValueOnce({
        ...mockUserInput,
        _id: "12345",
      });

      await expect(userService.create(mockUserInput)).rejects.toThrow(
        "An account with that email already exists"
      );

      expect(UserModel.create).not.toHaveBeenCalled();
    });

    it("should throw if username already exists", async () => {
      const mockUserInput: UserInput = {
        username: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
        role: Roles.READER,
      };

      // 1) findOne({ email }) -> null
      // 2) findOne({ username }) -> encontrado
      (UserModel.findOne as jest.Mock)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ _id: "999", username: "John Doe" });

      await expect(userService.create(mockUserInput)).rejects.toThrow(
        "Username already taken"
      );

      expect(UserModel.create).not.toHaveBeenCalled();
    });
  });

  describe("findByEmail", () => {
    it("should resolve the user found by email", async () => {
      const mockUser = { email: "test@example.com" };
      (UserModel.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

      const result = await userService.findByEmail("test@example.com");

      // Validamos el comportamiento (resultado), no el conteo de llamadas
      expect(result).toEqual(mockUser);
      expect(UserModel.findOne).toHaveBeenCalledWith({
        email: "test@example.com",
      });
    });
  });

  describe("findAll", () => {
    it("should return all users", async () => {
      const mockUsers = [{ email: "a@a.com" }, { email: "b@b.com" }];
      (UserModel.find as jest.Mock).mockResolvedValueOnce(mockUsers);

      const result = await userService.findAll();

      expect(UserModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe("login", () => {
    it("should throw if user not found", async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValueOnce(null);

      await expect(userService.login("x@x.com", "pass")).rejects.toThrow(
        "Invalid credentials"
      );
    });

    it("should throw if password is invalid", async () => {
      const mockUser: any = { email: "test@test.com", password: "hashed" };
      (UserModel.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      await expect(userService.login("test@test.com", "wrong")).rejects.toThrow(
        "Invalid credentials"
      );
    });

    it("should return token if login succeeds", async () => {
      const mockUser: any = {
        _id: "1",
        email: "test@test.com",
        password: "hashed",
        role: Roles.READER,
      };
      (UserModel.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      (jwt.sign as jest.Mock).mockReturnValue("mockToken");

      const result = await userService.login("test@test.com", "correct");

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: "1", email: "test@test.com", role: Roles.READER },
        expect.any(String),
        { expiresIn: "30m" }
      );
      expect(result).toBe("mockToken");
    });
  });

  describe("update", () => {
    it("should throw if user not exists", async () => {
      (UserModel.findById as jest.Mock).mockResolvedValueOnce(null);

      await expect(
        userService.update("123", { username: "new" }, Roles.READER)
      ).rejects.toThrow("User doesn't exist");
    });

    it("should update user without password", async () => {
      const mockUser: any = { _id: "123" };
      (UserModel.findById as jest.Mock).mockResolvedValueOnce(mockUser);
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce({
        ...mockUser,
        username: "new",
      });

      const result = await userService.update(
        "123",
        { username: "new" },
        Roles.READER
      );

      expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "123",
        { username: "new" },
        { new: true }
      );
      expect(result?.username).toBe("new");
    });

    it("should hash password if provided", async () => {
      const mockUser: any = { _id: "123" };
      (UserModel.findById as jest.Mock).mockResolvedValueOnce(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce("newHashed");
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce({
        ...mockUser,
        password: "newHashed",
      });

      const result = await userService.update(
        "123",
        { password: "newpass" },
        Roles.READER
      );

      expect(bcrypt.hash).toHaveBeenCalledWith("newpass", 10);
      expect(result?.password).toBe("newHashed");
    });
  });

  describe("delete", () => {
    it("should throw if user not exists", async () => {
      (UserModel.findById as jest.Mock).mockResolvedValueOnce(null);

      await expect(userService.delete("123")).rejects.toThrow(
        "User doesn't exist"
      );
    });

    it("should delete user if exists", async () => {
      const mockUser: any = { _id: "123" };
      (UserModel.findById as jest.Mock).mockResolvedValueOnce(mockUser);
      (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValueOnce(
        mockUser
      );

      const result = await userService.delete("123");

      expect(UserModel.findByIdAndDelete).toHaveBeenCalledWith("123");
      expect(result).toEqual(mockUser);
    });
  });
});
