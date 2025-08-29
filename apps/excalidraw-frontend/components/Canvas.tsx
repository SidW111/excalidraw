import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";

export default function Canvas({ roomId ,socket}: { roomId: string,socket:WebSocket }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      initDraw(canvas, roomId, socket);
    }
  }, [canvasRef]);

  return (
    <div className="">
      <canvas
        ref={canvasRef}
        className="bg-white"
        height={2000}
        width={2000}
      ></canvas>
    </div>
  );
}
