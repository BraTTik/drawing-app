import { Point } from "../point";

export interface Rect {
  position: Point;
  width: number;
  height: number;
}

export interface AnchorRect extends Rect {
  anchor: Point;
}
