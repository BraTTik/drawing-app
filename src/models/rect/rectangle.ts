import { Point } from "../point";
import { Shape } from "../shape";
import { Rect } from "./interface";
import { addPoints, subPoints } from "../../utils";

export class Rectangle extends Shape implements Rect {
  public get position(): Point {
    return this._position;
  }
  public set position(value: Point) {
    this._position = value;
  }

  constructor(
    protected _position: Point,
    public width: number,
    public height: number,
  ) {
    super();
  }

  drawShape(ctx: CanvasRenderingContext2D) {
    const pos = addPoints(this.position, this.origin);
    ctx.rect(pos.x, pos.y, this.width, this.height);
  }

  drawGizmoShape(ctx: CanvasRenderingContext2D) {
    const pos = addPoints(this.position, this.origin);
    ctx.rect(pos.x, pos.y, this.width, this.height);
  }

  protected toOriginFigure() {
    this.origin = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    };

    this.position = subPoints(this.position, this.origin);
  }
}
