import { Point } from "./point";
import { Shape } from "./shape";
import { getPointsRect } from "../utils";
import { Vector } from "./vector";

export class Path extends Shape {
  protected points: Vector[];

  constructor(points: Point[] = []) {
    super();
    this.points = points.map((p) => Vector.fromPoint(p));
  }

  addPoint(point: Point | Vector) {
    this.points.push(Vector.fromPoint(point));
  }

  drawShape(ctx: CanvasRenderingContext2D) {
    if (!this.points.length) return;

    ctx.beginPath();
    const startPoint = this.points[0].add(this.origin);
    ctx.moveTo(startPoint.x, startPoint.y);
    for (let i = 1; i < this.points.length; i++) {
      const point = this.points[i].add(this.origin);
      ctx.lineTo(point.x, point.y);
    }
  }

  drawGizmoShape(ctx: CanvasRenderingContext2D): void {
    const rect = getPointsRect(
      this.points.map((point) => point.add(this.origin)),
    );
    ctx.rect(rect.position.x, rect.position.y, rect.width, rect.height);
  }

  protected toOriginFigure() {
    this.origin = Vector.midVector(...this.points);
    for (const point of this.points) {
      const newPoint = point.subtract(this.origin);
      point.x = newPoint.x;
      point.y = newPoint.y;
    }
  }
}
