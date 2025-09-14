import { userService } from "../../services";
import { UserModel, UserDocument } from "../../models";
import bcrypt from "bcrypt";
import { UserInput } from "../../interfaces";
import { Roles } from "../../constants/rolesBurned";

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

jest.mock("../../models", () => ({
  UserModel: {
    create: jest.fn(),
    findOne: jest.fn(),
  },
}));

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

      const mockHashedPassword = "hashedPassword123";
      const mockCreatedUser: Partial<UserDocument> = {
        ...mockUserInput,
        _id: "12345",
        createdAt: new Date(),
        updatedAt: new Date(),
        role: Roles.READER, 
      };

      jest.spyOn(userService, "findByEmail").mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);
      (UserModel.create as jest.Mock).mockResolvedValue(mockCreatedUser);

      const result = await userService.create(mockUserInput);

      expect(bcrypt.hash).toHaveBeenCalledWith(mockUserInput.password, 10);
      expect(UserModel.create).toHaveBeenCalledWith({
        ...mockUserInput,
        password: mockHashedPassword,
      });
      expect(result).toEqual(mockCreatedUser);
    });

    it("should throw an error if the user already exists", async () => {
      const mockUserInput: UserInput = {
        username: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
        role: Roles.READER, 
      };

      jest.spyOn(userService, "findByEmail").mockResolvedValue({
        ...mockUserInput,
        _id: "12345",
      } as UserDocument);

      await expect(userService.create(mockUserInput)).rejects.toThrow(
        "An account with that email already exists" 
      );

      expect(userService.findByEmail).toHaveBeenCalledWith(mockUserInput.email);
      expect(UserModel.create).not.toHaveBeenCalled();
    });
  });
});
