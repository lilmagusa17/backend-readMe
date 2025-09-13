import { NextFunction, Request, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Not Authorized" });
    }

    try {
        token = token.replace("Bearer ", "");
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret");
        (req as any).user = decoded;
        next();

    } catch (error) {
        console.error(error);
        if (error instanceof TokenExpiredError) {
            return res.status(401).json({ message: "Token expired" });
        }
        return res.status(401).json({ message: "Not Authorized" });
    }

}
