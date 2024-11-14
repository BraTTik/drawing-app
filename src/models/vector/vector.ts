import { Point } from "../point";

export class Vector implements Point {
  constructor(
    public x: number,
    public y: number,
  ) {}

  add(v: Point) {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  subtract(v: Point) {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  static midVector(...v: Point[]) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const point of v) {
      if (point.x < minX) minX = point.x;
      if (point.x > maxX) maxX = point.x;
      if (point.y < minY) minY = point.y;
      if (point.y > maxY) maxY = point.y;
    }

    const width = maxX - minX;
    const height = maxY - minY;

    return new Vector(minX + width / 2, minY + height / 2);
  }

  static add(v1: Point, v2: Point) {
    return Vector.fromPoint(v1).add(v2);
  }

  static subtract(v1: Point, v2: Point) {
    return Vector.fromPoint(v1).subtract(v2);
  }

  static fromPoint(point: Point) {
    return new Vector(point.x, point.y);
  }
}
