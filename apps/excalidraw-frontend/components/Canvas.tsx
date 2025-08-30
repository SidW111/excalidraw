import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, MousePointer, Pencil, Square } from "lucide-react";
import { ReactNode } from "react";

enum Shapes {
  circle = "circle",
  rectangle = "rectangle",
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
  const [selectedTool, setSelectedTool] = useState<Shapes>(Shapes.cursor);

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
        height:'100vh',
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
  selectedTool: Shapes;
  setSelectedTool: (s: Shapes) => void;
}) {
  return (
    <div className="fixed  top-5 left-162 flex  items-center justify-center gap-2  text-white bg-gray-900 rounded-3xl p-2 ">
      <IconButton
        activated={selectedTool === Shapes.circle}
        onClick={() => {
          setSelectedTool(Shapes.circle);
        }}
        icon={<Circle />}
      />
      <IconButton
        activated={selectedTool === Shapes.rectangle}
        onClick={() => {
          setSelectedTool(Shapes.rectangle);
        }}
        icon={<Square />}
      />
      <IconButton
        activated={selectedTool === Shapes.pencil}
        onClick={() => {
          setSelectedTool(Shapes.pencil);
        }}
        icon={<Pencil />}
      />
      <IconButton
        activated={selectedTool === Shapes.cursor}
        onClick={() => {
          setSelectedTool(Shapes.cursor);
        }}
        icon={<MousePointer />}
      />
    </div>
  );
}
