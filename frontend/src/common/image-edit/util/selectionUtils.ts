import { BoundingBox, Point, Shape } from '@common/image-edit/types';
import { lineWidth } from '@common/image-edit/util/canvasShapes';

const rotatePoint = (point: Point, center: Point, angle: number): Point => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: cos * (point.x - center.x) - sin * (point.y - center.y) + center.x,
    y: sin * (point.x - center.x) + cos * (point.y - center.y) + center.y,
  };
};

const getRotatedBoundingBox = (arrow: Shape): BoundingBox => {
  const { startX, startY, endX, endY } = arrow;
  const minStartX = Math.min(startX, endX);
  const maxStartX = Math.max(startX, endX);
  const minStartY = Math.min(startY, endY);
  const maxStartY = Math.max(startY, endY);

  const angle = Math.atan2(maxStartY - minStartY, maxStartX - minStartX);

  const p1: Point = { x: minStartX, y: minStartY - lineWidth / 2 };
  const p2: Point = { x: minStartX, y: minStartY + lineWidth / 2 };
  const p3: Point = { x: maxStartX, y: maxStartY + lineWidth / 2 };
  const p4: Point = { x: maxStartX, y: maxStartY - lineWidth / 2 };

  const centerShaft: Point = {
    x: (minStartX + maxStartX) / 2,
    y: (minStartY + maxStartY) / 2,
  };

  const rotatedP1 = rotatePoint(p1, centerShaft, angle);
  const rotatedP2 = rotatePoint(p2, centerShaft, angle);
  const rotatedP3 = rotatePoint(p3, centerShaft, angle);
  const rotatedP4 = rotatePoint(p4, centerShaft, angle);

  const minX = Math.min(rotatedP1.x, rotatedP2.x, rotatedP3.x, rotatedP4.x);
  const maxX = Math.max(rotatedP1.x, rotatedP2.x, rotatedP3.x, rotatedP4.x);
  const minY = Math.min(rotatedP1.y, rotatedP2.y, rotatedP3.y, rotatedP4.y);
  const maxY = Math.max(rotatedP1.y, rotatedP2.y, rotatedP3.y, rotatedP4.y);

  return { minX, minY, maxX, maxY };
};

export const checkInsideRotatedRectangle = (
  line: Shape,
  position: Point
): boolean => {
  const boundingBox = getRotatedBoundingBox(line);
  return (
    position.x >= boundingBox.minX &&
    position.x <= boundingBox.maxX &&
    position.y >= boundingBox.minY &&
    position.y <= boundingBox.maxY
  );
};

export const checkInsideRectangle = (rectangle: Shape, position: Point) => {
  return (
    position.x >= rectangle.startX &&
    position.x <= rectangle.endX &&
    position.y >= rectangle.startY &&
    position.y <= rectangle.endY
  );
};

export const checkInsideCircle = (circle: Shape, position: Point) => {
  const radiusX = Math.abs(circle.endX - circle.startX) / 2;
  const radiusY = Math.abs(circle.endY - circle.startY) / 2;
  const centerX = circle.startX + (circle.endX - circle.startX) / 2;
  const centerY = circle.startY + (circle.endY - circle.startY) / 2;

  const dx = position.x - centerX;
  const dy = position.y - centerY;
  return (dx * dx) / (radiusX * radiusX) + (dy * dy) / (radiusY * radiusY) <= 1;
};
