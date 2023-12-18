import { Shape } from '@common/image-edit/types';

export const lineWidth = 4;
export const arrowHeadLength = 20;

export const drawLine = (ctx: CanvasRenderingContext2D, shape: Shape) => {
  const { startX, startY, endX, endY, color } = shape;

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);

  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.stroke();
};

export const drawArrow = (ctx: CanvasRenderingContext2D, shape: Shape) => {
  const { startX, startY, endX, endY, color } = shape;

  ctx.beginPath();
  const dx = endX - startX;
  const dy = endY - startY;
  const angle = Math.atan2(dy, dx);
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);

  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX - arrowHeadLength * Math.cos(angle - Math.PI / 6),
    endY - arrowHeadLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    endX - arrowHeadLength * Math.cos(angle + Math.PI / 6),
    endY - arrowHeadLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();

  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();
};

export const drawCircle = (ctx: CanvasRenderingContext2D, shape: Shape) => {
  const { startX, startY, endX, endY, color } = shape;

  const radiusX = Math.abs(endX - startX) / 2;
  const radiusY = Math.abs(endY - startY) / 2;
  const centerX = startX + (endX - startX) / 2;
  const centerY = startY + (endY - startY) / 2;

  ctx.beginPath();
  ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);

  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.stroke();
};

export const drawRectangle = (ctx: CanvasRenderingContext2D, shape: Shape) => {
  const { startX, startY, endX, endY, color } = shape;

  ctx.beginPath();
  ctx.rect(startX, startY, endX - startX, endY - startY);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.closePath();
};

export const drawText = (ctx: CanvasRenderingContext2D, textShape: Shape) => {
  const { startX, startY, color, text } = textShape;
  if (!text) return;
  // const textHeight = 24;
  // const textWidth = ctx.measureText(text).width;
  // const correctedTextWidth = textWidth <= textHeight ? textHeight : textWidth;

  // ctx.beginPath();
  // ctx.fillStyle = 'white';
  // ctx.fillRect(
  //   startX,
  //   startY - textHeight,
  //   correctedTextWidth,
  //   textHeight * 1.3
  // );

  // ctx.strokeStyle = color;
  // ctx.lineWidth = 2;
  // ctx.strokeRect(
  //   textPosition.x,
  //   textPosition.y - textHeight,
  //   correctedTextWidth,
  //   textHeight * 1.3
  // );

  ctx.font = '24px Arial';
  ctx.fillStyle = color;
  ctx.fillText(text, startX, startY);
  ctx.closePath();
};

export const drawTextIndicator = (
  ctx: CanvasRenderingContext2D,
  shape: Shape
) => {
  drawText(ctx, { ...shape, text: 'Skriv her...' });
};

export const placeholderTextId = 'placeholder-text';
