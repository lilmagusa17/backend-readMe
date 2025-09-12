import { Request, Response, NextFunction } from "express";

export const authorize = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user; 

        if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
        }

        if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden: insufficient permissions" });
        }
        next();
  }
}
