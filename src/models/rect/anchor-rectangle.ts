import { Rectangle } from "./rectangle";
import { Vector } from "../vector";
import { Point } from "../point";

export class AnchorRectangle extends Rectangle {
  private _anchor: Vector;

  set position(point: Vector) {
    this._position = new Vector(
      Math.min(point.x, this._anchor.x),
      Math.min(point.y, this._anchor.y),
    );
    this.width = Math.abs(point.x - this._anchor.x);
    this.height = Math.abs(point.y - this._anchor.y);
  }

  get position() {
    return this._position;
  }

  constructor(
    position: Vector | Point,
    width: number,
    height: number,
    anchor?: Vector | Point,
  ) {
    super(position, width, height);
    const vPos = new Vector(position.x, position.y);
    this._anchor = anchor ? new Vector(anchor.x, anchor.y) : vPos;
    this._position = vPos;
  }

  toRect(): Rectangle {
    const rect = new Rectangle(this._position, this.width, this.height);
    rect.fillStyle = this.fillStyle;
    rect.strokeStyle = this.strokeStyle;
    rect.lineWidth = this.lineWidth;
    rect.fill = this.fill;
    rect.stroke = this.stroke;

    return rect;
  }
}
