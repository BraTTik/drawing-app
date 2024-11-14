import { Vector } from "../vector";

export interface Rect {
  position: Vector;
  width: number;
  height: number;
}

export interface AnchorRect extends Rect {
  anchor: Vector;
}
