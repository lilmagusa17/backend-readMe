import bcrypt from "bcrypt";
import { UserModel, UserDocument } from "../models";
import { RoleModel } from "../models";
import { UserInput, UserInputUpdate } from "../interfaces";

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

    let roleId = userInput.role;

    if (!isAdmin) {
      const readerRole = await RoleModel.findOne({ name: "reader" });
      if (!readerRole) throw new Error("Default role 'reader' not found in DB");
      roleId = readerRole._id.toString();
    } else {

      const role = await RoleModel.findById(roleId);
      if (!role) throw new ReferenceError("Invalid role");
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
    return UserModel.find().populate("role");
  }

  public async delete(email: string): Promise<UserDocument | null> {
    const userExists = await this.findByEmail(email);
    if (!userExists) {
      throw new ReferenceError("User doesn't exist");
    }
    return UserModel.findOneAndDelete({ email });
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
    }).populate("role");
  }
}

export const userService = new UserService();