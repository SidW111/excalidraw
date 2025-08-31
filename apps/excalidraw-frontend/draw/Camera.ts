export class Camera {
  private scale: number;
  private offSetX: number;
  private offSetY: number;

  constructor() {
    this.scale = 1;
    this.offSetX = 0;
    this.offSetY = 0;
  }

  applyTransformation(ctx: CanvasRenderingContext2D) {
    ctx.setTransform(this.scale, 0, 0, this.scale, this.offSetX, this.offSetY);
  }

  resetTransformation(ctx: CanvasRenderingContext2D) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  zoom(factor: number, centerX: number, centerY: number) {
    // Calculate the world coordinates of the mouse before zooming
    const worldX = (centerX - this.offSetX) / this.scale;
    const worldY = (centerY - this.offSetY) / this.scale; // Update the scale

    this.scale *= factor; // Calculate the new offset to keep the world coordinates under the mouse constant

    this.offSetX = centerX - worldX * this.scale;
    this.offSetY = centerY - worldY * this.scale;
  }

  pan(dx: number, dy: number) {
    this.offSetX += dx;
    this.offSetY += dy;
  }

  screenToWorld(x: number, y: number) {
    return {
      x: (x - this.offSetX) / this.scale,
      y: (y - this.offSetY) / this.scale,
    };
  }
  worldToScreen(x: number, y: number) {
    return {
      x: x * this.scale + this.offSetX,
      y: y * this.scale + this.offSetY,
    };
  }
}
