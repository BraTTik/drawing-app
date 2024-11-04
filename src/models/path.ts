import { Point } from "./point";
import { Shape } from "./shape";
import { addPoints, getCenterOrigin, getPointsRect, subPoints } from "../utils";

export class Path extends Shape {
  protected points: Point[];

  constructor(points: Point[] = []) {
    super();
    this.points = points;
  }

  addPoint(point: Point) {
    this.points.push(point);
  }

  drawShape(ctx: CanvasRenderingContext2D) {
    if (!this.points.length) return;

    ctx.beginPath();
    const startPoint = addPoints(this.points[0], this.origin);
    ctx.moveTo(startPoint.x, startPoint.y);
    for (let i = 1; i < this.points.length; i++) {
      const point = addPoints(this.points[i], this.origin);
      ctx.lineTo(point.x, point.y);
    }
  }

  drawGizmoShape(ctx: CanvasRenderingContext2D): void {
    const rect = getPointsRect(
      this.points.map((point) => addPoints(point, this.origin)),
    );
    ctx.rect(rect.position.x, rect.position.y, rect.width, rect.height);
  }

  protected toOriginFigure() {
    this.origin = getCenterOrigin(this.points).position;
    for (const point of this.points) {
      const newPoint = subPoints(point, this.origin);
      point.x = newPoint.x;
      point.y = newPoint.y;
    }
  }
}
