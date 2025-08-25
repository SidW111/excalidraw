import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { userMiddleware } from "./middleware";

const app = express();

app.post("/signup", async (req, res) => {});
app.post("/signin", async (req, res) => {
  const userId = 1;
  const token = jwt.sign({ userId }, JWT_SECRET);
});
app.post("/room", userMiddleware, async (req, res) => {
  res.json({
    roomId: 123,
  });
});

app.listen(3001, () => {
  console.log({ msg: "connected http" });
});
