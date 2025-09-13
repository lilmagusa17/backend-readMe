import bcrypt from "bcrypt";
import { UserModel, UserDocument } from "../models/user.model";
import { UserInput, UserInputUpdate } from "../interfaces";
import { Roles } from "../constants/rolesBurned";
import jwt from "jsonwebtoken";

class UserService {

  public async create(userInput: UserInput, isAdmin: boolean = false): Promise<UserDocument> {
    const userExists = await this.findByEmail(userInput.email);
    if (userExists) {
      throw new ReferenceError("An account with that email already exists");
    }

    const usernameExists = await UserModel.findOne({ username: userInput.username });
    if (usernameExists) {
      throw new ReferenceError("Username already taken");
    }

    if (!isAdmin) {
      userInput.role = Roles.READER;
    }
    if (userInput.password) {
      userInput.password = await bcrypt.hash(userInput.password, 10);
    }

    return UserModel.create(userInput);
  }

  public findByEmail(email: string): Promise<UserDocument | null> {
    return UserModel.findOne({ email });
  }

  public async findAll(): Promise<UserDocument[]> {
    return UserModel.find();
  }

  public async login(email: string, password: string): Promise<string> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new ReferenceError("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ReferenceError("Invalid credentials");
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "30m" }
    );

    return token;
  }

  public async update(
    email: string,
    userInput: UserInputUpdate,
    currentUserRole: string
  ): Promise<UserDocument | null> {
    const userExists = await this.findByEmail(email);
    if (!userExists) {
      throw new ReferenceError("User doesn't exist");
    }
    
    if (userInput.password) {
      userInput.password = await bcrypt.hash(userInput.password, 10);
    }

    return UserModel.findOneAndUpdate({ email }, userInput, {
      returnOriginal: false,
    });
  }

    public async delete(email: string): Promise<UserDocument | null> {
    const userExists = await this.findByEmail(email);
    if (!userExists) {
      throw new ReferenceError("User doesn't exist");
    }
    return UserModel.findOneAndDelete({ email });
  }
}


export const userService = new UserService();