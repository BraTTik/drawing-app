import { ControlPanel } from "./control-panel";
import { ColorId } from "./color-id";
import { Vector } from "./vector";

const getId = () => {
  let id = 1;
  return () => id++;
};

export abstract class Shape {
  public id;
  public strokeStyle = "black";
  public lineWidth = 1;
  public fillStyle = "";
  public fill = true;
  public stroke = true;
  public selected = false;
  public origin: Vector = new Vector(0, 0);

  protected isOriginated = false;
  protected colorId: ColorId;
  protected static idGetter = getId();

  protected constructor() {
    this.colorId = new ColorId(Shape.idGetter());
    this.id = this.colorId.value;
  }

  protected abstract drawShape(ctx: CanvasRenderingContext2D): void;
  protected abstract drawGizmoShape(ctx: CanvasRenderingContext2D): void;
  protected abstract toOriginFigure(): void;

  public toFigure() {
    if (this.isOriginated) return this;
    this.toOriginFigure();
    this.isOriginated = true;
    return this;
  }

  get hitColor() {
    return this.colorId.color;
  }

  applyControlOptions(control: ControlPanel) {
    this.fillStyle = control.fillColor();
    this.strokeStyle = control.lineColor();
    this.lineWidth = control.lineWidth();
    this.fill = control.isFill();
    this.stroke = control.isStroke();
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = this.fillStyle;
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    this.drawShape(ctx);
    if (this.fill) {
      ctx.fill();
    }
    if (this.stroke) {
      ctx.stroke();
    }
    if (this.selected) {
      this.drawGizmo(ctx);
    }
  }

  public static getColorId(color: [number, number, number, number]) {
    return ColorId.getColorId(color);
  }

  public drawHitRegion(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.colorId.color;
    ctx.strokeStyle = this.colorId.color;
    ctx.lineWidth = this.lineWidth + 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    this.drawShape(ctx);
    if (this.fill) {
      ctx.fill();
    }
    if (this.stroke) {
      ctx.stroke();
    }
  }

  protected drawGizmo(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "orange";
    ctx.setLineDash([5, 5]);
    this.drawGizmoShape(ctx);
    ctx.stroke();
    ctx.restore();
    this.drawOrigin(ctx);
  }

  protected drawOrigin(ctx: CanvasRenderingContext2D) {
    if (this.isOriginated) {
      ctx.beginPath();
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "orange";
      ctx.setLineDash([5, 5]);
      ctx.arc(this.origin.x, this.origin.y, 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }
}
