import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, MoreHorizontalIcon, MousePointer, MoveHorizontal, Pencil, PenLine, Slash, Square } from "lucide-react";
import { Game } from "@/draw/Game";

export enum Tools {
  circle = "circle",
  rectangle = "rect",
  pencil = "pencil",
  line = "line",
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
  const [game, setGame] = useState<Game>();
  const [selectedTool, setSelectedTool] = useState<Tools>(Tools.cursor);

  useEffect(() => {
    game?.setTool(selectedTool);
  }, [selectedTool, game]);

  useEffect(() => {
    if (canvasRef.current) {
      const g = new Game(canvasRef.current, socket, roomId);
      setGame(g);

      return (()=>{
        g.destroy()
      })
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
        activated={selectedTool === Tools.line}
        onClick={()=>{
          setSelectedTool(Tools.line)
        }}
        icon={<Slash/>}
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
