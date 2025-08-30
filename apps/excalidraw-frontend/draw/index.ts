import { Tools } from "@/components/Canvas";
import { BACKEND_URL } from "@/config";
import axios from "axios";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    };

export async function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket
) {
  const ctx = canvas.getContext("2d");

  const existingShape: Shape[] = await getExistingShapes(roomId);

  if (!ctx) {
    return;
  }

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.type === "chat") {
      const parsedShape = JSON.parse(message.message);
      existingShape.push(parsedShape.shape);
      clearCanvas(canvas, ctx, existingShape);
    }
  };

  clearCanvas(canvas, ctx, existingShape);

  let clicked = false;
  let startX = 0;
  let startY = 0;
  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    const width = e.clientX - startX;
    const height = e.clientY - startY;

    let shape: Shape | null = null;

    //@ts-ignore
    const selectedTool = window.selectedTool;

    if (selectedTool === Tools.rectangle) {
      shape = {
        type: "rect",
        x: startX,
        y: startY,
        width,
        height,
      };
    } else if (selectedTool === Tools.circle) {
      const radius = Math.max(height, width) / 2;
      shape = {
        type: "circle",
        centerX: startX + radius,
        centerY: startY + radius,
        radius: Math.abs(radius),
      };
    }

    if (!shape) return;
    existingShape.push(shape);
    socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({ shape }),
        roomId,
      })
    );
  });

  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      const width = e.clientX - startX;
      const height = e.clientY - startY;
      clearCanvas(canvas, ctx, existingShape);
      ctx.strokeStyle = "rgba(255,255,255)";
      //@ts-ignore
      const selectedTools = window.selectedTool;
      console.log(selectedTools);
      if (selectedTools === Tools.rectangle) {
        ctx.strokeRect(startX, startY, width, height);
      } else if (selectedTools === Tools.circle) {
        const radius = Math.max(height, width) / 2;
        const centerX = startX + radius;
        const centerY = startY + radius;
        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
      }
    }
  });
}

function clearCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  existingShape: Shape[]
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0,0,0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  existingShape.map((shape) => {
    if (shape.type === Tools.rectangle) {
      ctx.strokeStyle = "rgba(255,255,255)";
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === Tools.circle) {
      ctx.beginPath();
      ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
    }
  });
}

async function getExistingShapes(roomId: string) {
  const res = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
  const messages = res.data.messages;
  const shapes = messages.map((x: { message: string }) => {
    const messageData = JSON.parse(x.message);
    return messageData.shape;
  });
  return shapes;
}
