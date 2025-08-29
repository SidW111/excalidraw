"use client";

import { BACKEND_URL } from "@/config";
import axios from "axios";
import { error } from "console";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AuthPage({ IsSignIn }: { IsSignIn: boolean }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const submitHandler = async () => {
    if (IsSignIn) {
      try {
        const res = await axios.post(`${BACKEND_URL}/signin`, {
          username,
          password,
        });

        console.log(res);

        if (res.data.success) {
          localStorage.setItem("token", res.data.token);
          console.log("sign in successful");
          router.push("/canvas");
        }
      } catch (error) {
        console.log(error, "error from sign in");
      }
    } else if (!IsSignIn) {
      try {
        const res = await axios.post(`${BACKEND_URL}/signup`, {
          name,
          username,
          password,
        });

        console.log(res);

        if (res.data.success) {
          console.log("sign up successful");
          router.push("/signin");
        }
      } catch (error) {
        console.log(error, "error from sign up");
      }
    }
  };
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="p-5 m-5">
        <div className="flex flex-col gap-2">
          {!IsSignIn && (
            <input
              onChange={(e) => {
                setName(e.target.value);
              }}
              type="text"
              placeholder="name"
              className="border  p-2 rounded-md"
            />
          )}
          <input
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            type="text"
            placeholder="email"
            className="border  p-2 rounded-md"
          />
          <input
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            placeholder="password"
            className="border  p-2 rounded-md"
          />
          <button
            type="submit"
            onClick={submitHandler}
            className="rounded  py-2 border  cursor-pointer bg-blue-500 hover:bg-blue-700"
          >
            {IsSignIn ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
