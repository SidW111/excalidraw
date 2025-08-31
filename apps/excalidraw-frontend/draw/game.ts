import { Tools } from "@/components/Canvas";
import { getExistingShapes } from "./http";
import { Camera } from "./Camera";

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
    }
  | {
      type: "pencil";
      points: { x: number; y: number }[];
    }
  | {
      type: "line";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    };

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[];
  private roomId: string;
  private isDrawing: boolean;
  private startX = 0;
  private startY = 0;
  private endX = 0;
  private endY = 0;
  private socket: WebSocket;
  private selectedTool: Tools = Tools.cursor;
  private currentPencilStroke: { x: number; y: number }[] = [];
  private camera: Camera;
  private lastX = 0;
  private lastY = 0;
  private isPanning = false;

  constructor(canvas: HTMLCanvasElement, socket: WebSocket, roomId: string) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.existingShapes = [];
    this.roomId = roomId;
    this.isDrawing = false;
    this.socket = socket;
    this.camera = new Camera();
    this.init();
    this.initHandlers();
    this.initMouseHandlers();
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.mousedownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseupHandler);
    this.canvas.removeEventListener("mousemove", this.mousemoveHandler);
    this.canvas.removeEventListener("wheel", this.wheelHandler);
    this.canvas.removeEventListener("contextmenu", this.contextMenuHandler);
    this.canvas.removeEventListener("touchstart", this.touchStartHandler);
    this.canvas.removeEventListener("touchmove", this.touchMoveHandler);
    this.canvas.removeEventListener("touchend", this.touchEndHandler);
  }

  setTool(tool: Tools) {
    this.selectedTool = tool;
  }

  async init() {
    this.existingShapes = await getExistingShapes(this.roomId);
    this.clearCanvas();
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "chat") {
        try {
          const parsedShape = JSON.parse(message.message);
          if (parsedShape.shape) {
            this.existingShapes.push(parsedShape.shape);
            this.clearCanvas();
          }
        } catch (e) {
          console.error("Failed to parse shape from message:", e);
        }
      }
    };
  }

  clearCanvas() {
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "rgba(0,0,0)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();

    this.camera.applyTransformation(this.ctx);

    this.existingShapes.forEach((shape) => {
      this.drawShape(shape);
    });
  }

  private drawShape(shape: Shape) {
    this.ctx.strokeStyle = "rgba(255,255,255)";
    if (shape.type === "rect") {
      this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "circle") {
      this.ctx.beginPath();
      this.ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.closePath();
    } else if (shape.type === "line") {
      this.ctx.beginPath();
      this.ctx.moveTo(shape.startX, shape.startY);
      this.ctx.lineTo(shape.endX, shape.endY);
      this.ctx.stroke();
      this.ctx.closePath();
    } else if (shape.type === "pencil") {
      if (shape.points.length === 0) return;
      this.ctx.beginPath();
      this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
      for (let i = 1; i < shape.points.length; i++) {
        this.ctx.lineTo(shape.points[i].x, shape.points[i].y);
      }
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mousedownHandler);
    this.canvas.addEventListener("mouseup", this.mouseupHandler);
    this.canvas.addEventListener("mousemove", this.mousemoveHandler);
    this.canvas.addEventListener("wheel", this.wheelHandler, {
      passive: false,
    });
    this.canvas.addEventListener("contextmenu", this.contextMenuHandler);
    this.canvas.addEventListener("touchstart", this.touchStartHandler);
    this.canvas.addEventListener("touchmove", this.touchMoveHandler);
    this.canvas.addEventListener("touchend", this.touchEndHandler);
  }

  wheelHandler = (e: WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    const rect = this.canvas.getBoundingClientRect();
    this.camera.zoom(factor, e.clientX - rect.left, e.clientY - rect.top);
    this.clearCanvas();
  };

  mousedownHandler = (e: MouseEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;
    if (e.button === 1 || e.button === 2) {
      // Middle or right mouse button
      this.isPanning = true;
      this.lastX = canvasX;
      this.lastY = canvasY;
      return;
    }
    if (e.button !== 0) return; // Only left click for drawing
    this.isDrawing = true;
    const worldPos = this.camera.screenToWorld(canvasX, canvasY);
    this.startX = worldPos.x;
    this.startY = worldPos.y;

    if (this.selectedTool === Tools.pencil) {
      this.currentPencilStroke = [{ x: worldPos.x, y: worldPos.y }];
    }
  };

  mousemoveHandler = (e: MouseEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;
    if (this.isPanning) {
      this.camera.pan(canvasX - this.lastX, canvasY - this.lastY);
      this.lastX = canvasX;
      this.lastY = canvasY;
      this.clearCanvas();
      return;
    }
    if (this.isDrawing) {
      const worldPos = this.camera.screenToWorld(canvasX, canvasY);
      this.endX = worldPos.x;
      this.endY = worldPos.y;
      this.clearCanvas(); // Draw preview of current shape
      this.ctx.strokeStyle = "rgba(255,255,255)";
      if (this.selectedTool === Tools.rectangle) {
        const width = this.endX - this.startX;
        const height = this.endY - this.startY;
        this.ctx.strokeRect(this.startX, this.startY, width, height);
      } else if (this.selectedTool === Tools.circle) {
        const radiusX = (this.endX - this.startX) / 2;
        const radiusY = (this.endY - this.startY) / 2;
        const radius = Math.sqrt(radiusX * radiusX + radiusY * radiusY);
        const centerX = this.startX + radiusX;
        const centerY = this.startY + radiusY;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (this.selectedTool === Tools.line) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(this.endX, this.endY);
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (this.selectedTool === Tools.pencil) {
        this.currentPencilStroke.push({ x: this.endX, y: this.endY });
        if (this.currentPencilStroke.length > 1) {
          this.ctx.beginPath();
          this.ctx.moveTo(
            this.currentPencilStroke[0].x,
            this.currentPencilStroke[0].y
          );
          for (let i = 1; i < this.currentPencilStroke.length; i++) {
            this.ctx.lineTo(
              this.currentPencilStroke[i].x,
              this.currentPencilStroke[i].y
            );
          }
          this.ctx.stroke();
          this.ctx.closePath();
        }
      }
    }
  };

  mouseupHandler = (e: MouseEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;
    if (e.button === 1 || e.button === 2) {
      this.isPanning = false;
      return;
    }
    if (e.button !== 0 || !this.isDrawing) return;
    this.isDrawing = false;
    const worldPos = this.camera.screenToWorld(canvasX, canvasY);
    this.endX = worldPos.x;
    this.endY = worldPos.y;

    let shape: Shape | null = null;

    if (this.selectedTool === Tools.rectangle) {
      const width = this.endX - this.startX;
      const height = this.endY - this.startY;
      shape = {
        type: "rect",
        x: this.startX,
        y: this.startY,
        width,
        height,
      };
    } else if (this.selectedTool === Tools.circle) {
      const radiusX = (this.endX - this.startX) / 2;
      const radiusY = (this.endY - this.startY) / 2;
      const radius = Math.sqrt(radiusX * radiusX + radiusY * radiusY);
      const centerX = this.startX + radiusX;
      const centerY = this.startY + radiusY;
      shape = {
        type: "circle",
        centerX,
        centerY,
        radius,
      };
    } else if (this.selectedTool === Tools.line) {
      shape = {
        type: "line",
        startX: this.startX,
        startY: this.startY,
        endX: this.endX,
        endY: this.endY,
      };
    } else if (this.selectedTool === Tools.pencil) {
      if (this.currentPencilStroke.length > 1) {
        shape = {
          type: "pencil",
          points: this.currentPencilStroke,
        };
      }
      this.currentPencilStroke = [];
    }

    if (!shape) return;
    this.existingShapes.push(shape);
    this.socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({ shape }),
        roomId: this.roomId,
      })
    );
  };

  // New Event Handlers for Touch and Context Menu
  contextMenuHandler = (e: MouseEvent) => {
    e.preventDefault();
  };

  touchStartHandler = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      this.isPanning = true;
      const rect = this.canvas.getBoundingClientRect();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      this.lastX = (touch1.clientX + touch2.clientX) / 2 - rect.left;
      this.lastY = (touch1.clientY + touch2.clientY) / 2 - rect.top;
    }
  };

  touchMoveHandler = (e: TouchEvent) => {
    if (this.isPanning && e.touches.length === 2) {
      const rect = this.canvas.getBoundingClientRect();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentX = (touch1.clientX + touch2.clientX) / 2 - rect.left;
      const currentY = (touch1.clientY + touch2.clientY) / 2 - rect.top;

      this.camera.pan(currentX - this.lastX, currentY - this.lastY);
      this.lastX = currentX;
      this.lastY = currentY;
      this.clearCanvas();
    }
  };

  touchEndHandler = (e: TouchEvent) => {
    this.isPanning = false;
  };
}
