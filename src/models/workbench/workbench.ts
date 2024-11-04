import { Rect } from "../rect";
import { getCenter, translateToCenter } from "../../utils";
import { Shape } from "../shape";
import { Point } from "../point";

export type StageRect = {
  width: number;
  height: number;
};

export class Workbench {
  public readonly canvas: HTMLCanvasElement;
  public readonly ctx: CanvasRenderingContext2D;

  protected hitCanvas: HTMLCanvasElement;
  protected hitCtx: CanvasRenderingContext2D;
  protected stageRect: Rect;
  protected canvasRect: Rect;

  public shapes: Map<number, Shape> = new Map();
  public selectedShapes: Set<number> = new Set();

  constructor(root: string, rect: StageRect) {
    const canvas = document.getElementById(root) as HTMLCanvasElement;
    const hitCanvas = document.createElement("canvas");

    this.canvasRect = {
      width: window.innerWidth,
      height: window.innerHeight,
      position: { x: 0, y: 0 },
    };

    if (!canvas) {
      throw new Error("No canvas element with id: " + root);
    }

    const ctx = canvas.getContext("2d");
    const hitCtx = hitCanvas.getContext("2d", { willReadFrequently: true });
    if (!ctx || !hitCtx) {
      throw new Error("Canvas Rendering Context 2D is not supported");
    }

    this.ctx = ctx;
    this.hitCtx = hitCtx;
    this.canvas = canvas;
    this.hitCanvas = hitCanvas;

    this.stageRect = {
      width: rect.width,
      height: rect.height,
      position: translateToCenter(getCenter(this.canvasRect), {
        width: rect.width,
        height: rect.height,
        position: { x: 0, y: 0 },
      }).position,
    };

    this.fitCanvas();
    this.clearCanvas();
    window.addEventListener("resize", this.fitCanvas.bind(this));
  }

  public toggleSelectedShape(id: number) {
    const shape = this.shapes.get(id);
    if (!shape) return;
    if (this.selectedShapes.has(id)) {
      this.selectShape(id);
    } else {
      this.unselectShape(id);
    }
  }

  public selectShape(id: number) {
    const shape = this.shapes.get(id);
    if (!shape) return;
    this.selectedShapes.add(id);
    shape.selected = true;
  }

  public unselectShape(id: number) {
    const shape = this.shapes.get(id);
    if (!shape) return;
    this.selectedShapes.delete(id);
    shape.selected = false;
  }

  public unselectShapes() {
    this.selectedShapes.forEach((id) => {
      this.unselectShape(id);
    });
  }

  public deleteShape(id: number) {
    this.shapes.delete(id);
    this.selectedShapes.delete(id);
  }

  public deleteSelectedShapes() {
    this.selectedShapes.forEach((id) => {
      this.deleteShape(id);
    });
  }

  public addShape(shape: Shape) {
    shape.toFigure();
    this.shapes.set(shape.id, shape);
  }

  public drawShapes(shapes?: Iterable<Shape>) {
    this.clearCanvas();
    shapes = shapes ?? this.shapes.values();
    for (let shape of shapes) {
      this.ctx.lineWidth = shape.lineWidth;
      this.ctx.strokeStyle = shape.strokeStyle;
      this.ctx.fillStyle = shape.fillStyle;

      this.hitCtx.lineWidth = shape.lineWidth + 5;
      this.hitCtx.fillStyle = shape.hitColor;
      this.hitCtx.strokeStyle = shape.hitColor;

      shape.draw(this.ctx);
      shape.drawHitRegion(this.hitCtx);
    }
  }

  public testPoint(point: Point) {
    const { x, y } = point;
    const [r, g, b, a] = this.hitCtx.getImageData(x, y, 1, 1).data;
    const id = Shape.getColorId([r, g, b, a]);

    return this.shapes.get(id) ?? null;
  }

  public clearCanvas() {
    this.ctx.fillStyle = "gray";
    this.ctx.fillRect(0, 0, this.canvasRect.width, this.canvasRect.height);

    this.ctx.fillStyle = "white";

    this.ctx.fillRect(
      this.stageRect.position.x,
      this.stageRect.position.y,
      this.stageRect.width,
      this.stageRect.height,
    );
    this.hitCtx.clearRect(0, 0, this.canvasRect.width, this.canvasRect.height);
  }

  private fitCanvas() {
    this.canvasRect = {
      ...this.canvasRect,
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.canvas.width = this.canvasRect.width;
    this.canvas.height = this.canvasRect.height;
    this.hitCanvas.width = this.canvasRect.width;
    this.hitCanvas.height = this.canvasRect.height;

    this.stageRect = {
      ...this.stageRect,
      position: translateToCenter(getCenter(this.canvasRect), this.stageRect)
        .position,
    };

    this.clearCanvas();
    this.drawShapes();
  }
}
