"use client";

import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import Canvas from "./Canvas";

export default function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  
  useEffect(() => {
    const token = localStorage.getItem("token"); // ✅ fetch inside useEffect
    if (!token) return;
  
    const ws = new WebSocket(`${WS_URL}?token=${token}`);

    ws.onopen = () => {
      setSocket(ws);
      ws.send(JSON.stringify({
        type:"join_room",
        roomId
      }))
    };
  }, []);

  if (!socket) {
    return <div>connecting to server....</div>;
  }
  return (
    <div>
      <Canvas roomId={roomId} socket={socket}/>
    </div>
  );
}
