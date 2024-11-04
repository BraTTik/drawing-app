import { Rect } from "models/rect";
import { Point } from "models/point";

export const getCenter = (rect: Rect): Point => {
  return {
    x: rect.position.x + rect.width / 2,
    y: rect.position.y + rect.height / 2,
  };
};

export const translateToCenter = (point: Point, rect: Rect): Rect => {
  const position: Point = {
    x: point.x - rect.width / 2,
    y: point.y - rect.height / 2,
  };

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
    position: { x: minX, y: minY },
  };
};

export const getCenterOrigin = (points: Iterable<Point>): Rect => {
  const rect = getPointsRect(points);
  return {
    ...rect,
    position: getCenter(rect),
  };
};

export const addPoints = (a: Point, b: Point): Point => ({
  x: a.x + b.x,
  y: a.y + b.y,
});
export const subPoints = (a: Point, b: Point): Point => ({
  x: a.x - b.x,
  y: a.y - b.y,
});
