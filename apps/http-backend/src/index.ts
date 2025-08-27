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
import { genSalt } from "bcryptjs";
import bcrypt from "bcryptjs";

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const parsedData = CreateUserSchema.safeParse(req.body);
  console.log(parsedData);
  if (!parsedData.success) {
    res.json({
      message: "incorrect input",
    });
    return;
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(parsedData.data.password, salt);
    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data.username,
        password: hashedPass,
        name: parsedData.data.name,
      },
    });

    if (user) {
      res.json({ userId: user.id, message: "User created successfully" });
    }
  } catch (error) {
    res.status(404).json({
      message: "Email Already Exists",
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
    const user = await prismaClient.user.findFirst({
      where: {
        email: parsedData.data.username,
      },
    });

    if (!user) {
      res.status(401).json({
        message: "Email not found",
      });
      return;
    }
    const isMatch = await bcrypt.compare(
      parsedData.data.password,
      (user as any).password
    );
    if (!isMatch) {
      res.status(401).json({
        message: "Incorrect Password",
      });
      return;
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({
      token: token,
      message: "Sign In Successful",
    });
  } catch (error) {
    console.log("error during signin", error);
    res.status(403).json({
      message: "Error during signin",
    });
  }
});
app.post("/room", userMiddleware, async (req, res) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "incorrect input",
    });
    return;
  }
  //@ts-ignore
  const userId = req.userId;
  console.log(userId);
  try {
    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data.name,
        admin: {
          connect: {
            id: userId,
          },
        },
      },
    });
    if (room) {
      console.log(room.id);
    }
    res.json({
      room: room.id,
    });
    return;
  } catch (error) {
    console.log(error, "error creating room");
    res.status(404).json({
      message: "room already exists with the same name",
    });
  }
});

app.listen(3001, () => {
  console.log({ msg: "connected http" });
});
