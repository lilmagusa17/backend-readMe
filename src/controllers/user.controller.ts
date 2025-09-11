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

      const currentUserRole = req.body.currentUserRole as Roles;

      const updatedUser = await userService.update(
        email,
        req.body as UserInputUpdate,
        currentUserRole
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(updatedUser);
    } catch (error: any) {
      if (error instanceof ReferenceError) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json(error);
    }
  }
}

export const userController = new UserController();
