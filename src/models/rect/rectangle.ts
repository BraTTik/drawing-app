import { Point } from "../point";
import { Shape } from "../shape";
import { Rect } from "./interface";
import { Vector } from "../vector";

export class Rectangle extends Shape implements Rect {
  protected _position: Vector;

  public get position(): Vector {
    return this._position;
  }
  public set position(value: Point | Vector) {
    this._position = new Vector(value.x, value.y);
  }

  constructor(
    position: Vector | Point,
    public width: number,
    public height: number,
  ) {
    super();
    this._position = new Vector(position.x, position.y);
  }

  drawShape(ctx: CanvasRenderingContext2D) {
    const pos = new Vector(this.position.x, this.position.y).add(this.origin);
    ctx.rect(pos.x, pos.y, this.width, this.height);
  }

  drawGizmoShape(ctx: CanvasRenderingContext2D) {
    const pos = this.position.add(this.origin);
    ctx.rect(pos.x, pos.y, this.width, this.height);
  }

  protected toOriginFigure() {
    this.origin = new Vector(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2,
    );

    this.position = this.position.subtract(this.origin);
  }
}
