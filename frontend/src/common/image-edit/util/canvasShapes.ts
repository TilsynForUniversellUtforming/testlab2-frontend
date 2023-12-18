import { Shape } from '@common/image-edit/types';
import { getTextParams } from '@common/image-edit/util/canvasDrawingUtils';

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
  const { startX, startY, color, text, textStyle } = textShape;
  if (!text || !textStyle) return;

  const { paddedText, x, y, width, height } = getTextParams(ctx, textShape);

  ctx.beginPath();
  if (textStyle === 'filled') {
    ctx.fillStyle = 'white';
    ctx.fillRect(x, y, width, height);
  }

  if (textStyle === 'filled' || textStyle === 'outline') {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
  }

  ctx.font = '24px Arial';
  ctx.fillStyle = color;
  ctx.fillText(paddedText, startX, startY);
  ctx.closePath();
};

export const placeholderTextId = 'placeholder-text';
