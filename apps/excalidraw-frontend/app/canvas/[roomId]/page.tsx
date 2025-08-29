"use client";

import { initDraw } from "@/draw";
import { useEffect, useRef } from "react";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {

    
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      initDraw(canvas)
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
