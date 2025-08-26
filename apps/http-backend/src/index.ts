import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { userMiddleware } from "./middleware";
import {
  CreateUserSchema,
  SignInSchema,
  CreateRoomSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

const app = express();

app.post("/signup", async (req, res) => {
  try {
    const parsedData = CreateUserSchema.safeParse(req.body);

    if (!parsedData.success) {
      res.json({
        message: "incorrect input",
      });
      return;
    }

    const result = await prismaClient.user.create({
      data: {
        email: parsedData.data.username,
        password: parsedData.data.password,
        name: parsedData.data.name,
      },
    });

    if (result) {
      res.json({ message: "User created successfully" });
    }
  } catch (error) {
    res.status(404).json({
      message: "create user failed",
    });
  }
});

app.post("/signin", async (req, res) => {
  const data = SignInSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: "incorrect input",
    });
    return;
  }
  const userId = 1;
  const token = jwt.sign({ userId }, JWT_SECRET);
});
app.post("/room", userMiddleware, async (req, res) => {
  const data = CreateRoomSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: "incorrect input",
    });
    return;
  }
  res.json({
    roomId: 123,
  });
});

app.listen(3001, () => {
  console.log({ msg: "connected http" });
});
