import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";

export default function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      initDraw(canvas, roomId, socket);
    }
  }, [canvasRef]);

  return (
    <div className="">
      <div className="fixed  top-5 left-100 flex  items-center justify-center gap-2  text-white bg-black p-2 ">
        <button className="px-6 py-3 bg-sky-500 rounded-2xl cursor-pointer">
          circle
        </button>
        <button className="px-6 py-3 bg-sky-500 rounded-2xl cursor-pointer">
          line
        </button>
        <button className="px-6 py-3 bg-sky-500 rounded-2xl cursor-pointer">
          rectangle
        </button>
        <button className="px-6 py-3 bg-sky-500 rounded-2xl cursor-pointer">
          none
        </button>
      </div>
      <canvas
        ref={canvasRef}
        className="bg-white"
        height={window.innerHeight}
        width={window.innerWidth}
      ></canvas>
    </div>
  );
}
