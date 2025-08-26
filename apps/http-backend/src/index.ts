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
  const parsedData = CreateUserSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.json({
      message: "incorrect input",
    });
    return;
  }
  try {
    const result = await prismaClient.user.create({
      data: {
        email: parsedData.data.username,
        password: parsedData.data.password,
        name: parsedData.data.name,
      },
    });

    if (result) {
      res.json({ userId: result.id, message: "User created successfully" });
    }
  } catch (error) {
    res.status(404).json({
      message: "create user failed",
    });
  }
});

app.post("/signin", async (req, res) => {
  const parsedData = SignInSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "incorrect input",
    });
    return;
  }

  try {
    const result = await prismaClient.user.findFirst({
      // data:{
      //   username:parsedData.data.username,
      //   password:parsedData.data.password
      // }
    });
  } catch (error) {}
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
