import { Request, Response } from "express";
import { userService } from "../services";
import { UserInput, UserInputUpdate } from "../interfaces";
import { Roles } from "../constants/rolesBurned";

class UserController {

  //Registro default (lector)
  public async register(req: Request, res: Response) {
    try {
      const newUser = await userService.create(req.body as UserInput, false);
      res.status(201).json(newUser);
    } catch (error: any) {
      if (error instanceof ReferenceError) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json(error);
    }
  }
  //Registro admin (con rol)
  public async create(req: Request, res: Response) {
    try {
      const newUser = await userService.create(req.body as UserInput, true);
      res.status(201).json(newUser);
    } catch (error: any) {
      if (error instanceof ReferenceError) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json(error);
    }
  }

  public async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const token = await userService.login(email, password);
      res.json({ token });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  public async getAll(req: Request, res: Response) {
    try {
      const users = await userService.findAll();
      res.json(users);
    } catch (error: any) {
      res.status(500).json(error);
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const { email } = req.params;
      if (!email) {
        return res.status(400).json({ message: "Email param is required" });
      }

      const loggedUser = (req as any).user;
      if (loggedUser.role !== "admin") {
        return res.status(403).json({ message: "Only admin can delete users" });
      }

      const deletedUser = await userService.delete(email);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User deleted successfully", user: deletedUser });
    } catch (error: any) {
      res.status(500).json(error);
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const { email } = req.params;
      if (!email) {
        return res.status(400).json({ message: "Email param is required" });
      }

      const loggedUser = (req as any).user;
      const updatedUser = await userService.update(
        email,
        req.body as UserInputUpdate,
        loggedUser.role
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(updatedUser);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export const userController = new UserController();
