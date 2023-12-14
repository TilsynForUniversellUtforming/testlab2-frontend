import { Point, Shape } from '@common/image-edit/types';

export const checkInsideRotatedLine = (
  line: Shape,
  point: Point,
  boundingBoxWidth: number
): boolean => {
  const angle = Math.atan2(line.endY - line.startY, line.endX - line.startX);
  const halfWidth = boundingBoxWidth / 2;

  const translatedX = point.x - line.startX;
  const translatedY = point.y - line.startY;

  const cos = Math.cos(-angle);
  const sin = Math.sin(-angle);

  const rotatedX = translatedX * cos - translatedY * sin;
  const rotatedY = translatedX * sin + translatedY * cos;

  const minX = Math.min(
    0,
    Math.sqrt((line.endX - line.startX) ** 2 + (line.endY - line.startY) ** 2)
  );
  const maxX = Math.max(
    0,
    Math.sqrt((line.endX - line.startX) ** 2 + (line.endY - line.startY) ** 2)
  );
  const minY = -halfWidth;

  return (
    rotatedX >= minX &&
    rotatedX <= maxX &&
    rotatedY >= minY &&
    rotatedY <= halfWidth
  );
};

export const checkInsideRectangle = (rectangle: Shape, point: Point) => {
  return (
    point.x >= rectangle.startX &&
    point.x <= rectangle.endX &&
    point.y >= rectangle.startY &&
    point.y <= rectangle.endY
  );
};

export const checkInsideCircle = (circle: Shape, point: Point) => {
  const radiusX = Math.abs(circle.endX - circle.startX) / 2;
  const radiusY = Math.abs(circle.endY - circle.startY) / 2;
  const centerX = circle.startX + (circle.endX - circle.startX) / 2;
  const centerY = circle.startY + (circle.endY - circle.startY) / 2;

  const dx = point.x - centerX;
  const dy = point.y - centerY;
  return (dx * dx) / (radiusX * radiusX) + (dy * dy) / (radiusY * radiusY) <= 1;
};

export const generateShapeId = (): string => Date.now().toString();
