import { z } from "zod";

export const CreateUserSchema = z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(8).max(20),
  name: z.string().min(3).max(20),
});
export const SignInSchema = z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(8).max(20),
});

export const CreateRoomSchema = z.object({
  roomId: z.string(),
});
