import { Rect } from "../models/rect";
import { Point } from "../models/point";
import { Vector } from "../models/vector";

export const getCenter = (rect: Rect): Vector => {
  return new Vector(
    rect.position.x + rect.width / 2,
    rect.position.y + rect.height / 2,
  );
};

export const translateToCenter = (point: Point, rect: Rect): Rect => {
  const position: Vector = new Vector(
    point.x - rect.width / 2,
    point.y - rect.height / 2,
  );

  return { position, width: rect.width, height: rect.height };
};

export const getPointsRect = (points: Iterable<Point>): Rect => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const point of points) {
    if (point.x < minX) minX = point.x;
    if (point.x > maxX) maxX = point.x;
    if (point.y < minY) minY = point.y;
    if (point.y > maxY) maxY = point.y;
  }

  const width = maxX - minX;
  const height = maxY - minY;

  return {
    width,
    height,
    position: new Vector(minX, minY),
  };
};
