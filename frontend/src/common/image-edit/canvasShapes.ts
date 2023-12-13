export const drawCircle = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  currentX: number,
  currentY: number
) => {
  const radiusX = Math.abs(currentX - startX) / 2;
  const radiusY = Math.abs(currentY - startY) / 2;
  const centerX = startX + (currentX - startX) / 2;
  const centerY = startY + (currentY - startY) / 2;

  ctx.beginPath();
  ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);

  ctx.lineWidth = 4;
  ctx.strokeStyle = 'red';
  ctx.stroke();
};

export const drawArrow = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  currentX: number,
  currentY: number
) => {
  const dx = currentX - startX;
  const dy = currentY - startY;
  const angle = Math.atan2(dy, dx);
  const headlength = 20;
  ctx.moveTo(startX, startY);
  ctx.lineTo(currentX, currentY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(currentX, currentY);
  ctx.lineTo(
    currentX - headlength * Math.cos(angle - Math.PI / 6),
    currentY - headlength * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    currentX - headlength * Math.cos(angle + Math.PI / 6),
    currentY - headlength * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fillStyle = 'red';
  ctx.fill();

  ctx.lineWidth = 4;
  ctx.strokeStyle = 'red';
  ctx.stroke();
};

export const drawRectangle = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  currentX: number,
  currentY: number
) => {
  ctx.beginPath();
  ctx.rect(startX, startY, currentX - startX, currentY - startY);
  ctx.lineWidth = 4;
  ctx.strokeStyle = 'red';
  ctx.stroke();
  ctx.closePath();
};
