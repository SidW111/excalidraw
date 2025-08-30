import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, MousePointer, Pencil, Square } from "lucide-react";
import { ReactNode } from "react";

export enum Tools {
  circle = "circle",
  rectangle = "rect",
  pencil = "pencil",
  cursor = "cursor",
}

export default function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<Tools>(Tools.cursor);

  useEffect(() => {
    //@ts-ignore
    window.selectedTool = selectedTool;
  }, [selectedTool]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      initDraw(canvas, roomId, socket);
    }
  }, [canvasRef]);

  return (
    <div
      className=""
      style={{
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <TopBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />

      <canvas
        ref={canvasRef}
        className="bg-white"
        height={window.innerHeight}
        width={window.innerWidth}
      ></canvas>
    </div>
  );
}

function TopBar({
  selectedTool,
  setSelectedTool,
}: {
  selectedTool: Tools;
  setSelectedTool: (s: Tools) => void;
}) {
  return (
    <div className="fixed  top-5 left-162 flex  items-center justify-center gap-2  text-white bg-gray-900 rounded-3xl p-2 ">
      <IconButton
        activated={selectedTool === Tools.circle}
        onClick={() => {
          setSelectedTool(Tools.circle);
        }}
        icon={<Circle />}
      />
      <IconButton
        activated={selectedTool === Tools.rectangle}
        onClick={() => {
          setSelectedTool(Tools.rectangle);
        }}
        icon={<Square />}
      />
      <IconButton
        activated={selectedTool === Tools.pencil}
        onClick={() => {
          setSelectedTool(Tools.pencil);
        }}
        icon={<Pencil />}
      />
      <IconButton
        activated={selectedTool === Tools.cursor}
        onClick={() => {
          setSelectedTool(Tools.cursor);
        }}
        icon={<MousePointer />}
      />
    </div>
  );
}
