import { Rectangle } from "./rectangle";
import { Point } from "../point";

export class AnchorRectangle extends Rectangle {
  private _anchor: Point;

  set position(point: Point) {
    this._position = {
      x: Math.min(point.x, this._anchor.x),
      y: Math.min(point.y, this._anchor.y),
    };
    this.width = Math.abs(point.x - this._anchor.x);
    this.height = Math.abs(point.y - this._anchor.y);
  }

  get position() {
    return this._position;
  }

  constructor(position: Point, width: number, height: number, anchor?: Point) {
    super(position, width, height);
    this._anchor = anchor ?? position;
    this._position = position;
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
