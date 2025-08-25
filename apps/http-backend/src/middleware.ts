import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export function userMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers["authorization"] ?? "";
  if (!token) {
    return res.json({ msg: "token not found" });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    if (decodedToken) {
      //@ts-ignore
      decodedToken.userId = req.userId;
      next();
    }
  } catch (error) {
    res.json({ message: "User is unauthorized" });
  }
}
