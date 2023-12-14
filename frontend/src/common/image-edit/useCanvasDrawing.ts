import {
  DrawMode,
  LineType,
  Point,
  Shape,
  ShapeStart,
} from '@common/image-edit/types';
import {
  arrowHeadLength,
  drawArrow,
  drawCircle,
  drawRectangle,
} from '@common/image-edit/util/canvasShapes';
import React, { useCallback, useEffect, useState } from 'react';

import {
  checkInsideCircle,
  checkInsideRectangle,
  checkInsideRotatedLine,
  generateShapeId,
} from './util/canvasDrawingUtils';

// TODO - TEXT
// useEffect(() => {
//   const isTextMode = lineType === 'text';
//
//   const handleKeyDown = (event: KeyboardEvent) => {
//     if (event.key === 'Backspace') {
//       setCurrentText((prevText) => prevText.slice(0, -1));
//       handleUndo();
//     } else if (event.key.length === 1) {
//       const nextText = currentText + event.key;
//       setCurrentText(nextText);
//       const paddedDrawText = ` ${nextText} `;
//       drawText(paddedDrawText);
//     }
//   };
//
//   const drawText = (text: string) => {
//     const { canvas, ctx } = getCanvasContext();
//     if (ctx && canvas) {
//       const textHeight = 24;
//       const textWidth = ctx.measureText(text).width;
//       const correctedTextWidth =
//         textWidth <= textHeight ? textHeight : textWidth;
//
//       ctx.fillStyle = 'white';
//       ctx.fillRect(
//         textPosition.x,
//         textPosition.y - textHeight,
//         correctedTextWidth,
//         textHeight * 1.3
//       );
//
//       ctx.strokeStyle = color;
//       ctx.lineWidth = 2;
//       ctx.strokeRect(
//         textPosition.x,
//         textPosition.y - textHeight,
//         correctedTextWidth,
//         textHeight * 1.3
//       );
//
//       ctx.font = '24px Arial';
//       ctx.fillStyle = color;
//       ctx.fillText(text, textPosition.x, textPosition.y);
//
//       saveToHistory(ctx);
//     }
//   };
//
//   if (isTextMode) {
//     window.addEventListener('keydown', handleKeyDown);
//   }
//
//   return () => {
//     window.removeEventListener('keydown', handleKeyDown);
//   };
// }, [lineType, currentText, textPosition, canvasRef, handleUndo, color]);
// TODO - TEXT

interface UseCanvasDrawingProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isEditMode: boolean;
  selectedFile: File | null;
}

interface UseCanvasDrawingReturnType {
  onMouseDown: (event: React.MouseEvent) => void;
  onMouseUp: (event: React.MouseEvent) => void;
  onMouseMove: (event: React.MouseEvent) => void;
  setLineType: (lineType: string) => void;
  lineType: LineType;
  setColor: (color: string) => void;
  color: string;
  setDrawMode: (drawMode: string) => void;
  drawMode: DrawMode;
  clearStrokes: () => void;
  undo: () => void;
  emptyStrokes: boolean;
}

const defaultStartPoint: Point = { x: 0, y: 0 };

const useCanvasDrawing = ({
  canvasRef,
  isEditMode,
  selectedFile,
}: UseCanvasDrawingProps): UseCanvasDrawingReturnType => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [cursorClickPoint, setCursorClickPoint] =
    useState<Point>(defaultStartPoint);
  const [draggingShape, setDraggingShape] = useState<Shape | undefined>();
  const [_currentText, setCurrentText] = useState<string>('');
  const [lineType, setLineType] = useState<LineType>('arrow');
  const [color, setColor] = useState<string>('#ff0000');
  const [shapeList, setShapeList] = useState<Shape[]>([]);
  const [shapeStart, setShapeStart] = useState<ShapeStart | undefined>();
  const [shapeInProgres, setShapeInProgress] = useState<Shape | undefined>();
  const [drawMode, setDrawMode] = useState<DrawMode>('draw');

  const getCanvasContext = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    return { canvas, ctx };
  };

  useEffect(() => {
    if (!selectedFile) {
      setShapeList([]);
      setCurrentText('');
      setCursorClickPoint(defaultStartPoint);
    }
  }, [selectedFile]);

  const draw = (shape: Shape) => {
    const { ctx } = getCanvasContext();

    if (ctx) {
      switch (shape.type) {
        case 'arrow':
          drawArrow(ctx, shape);
          break;
        case 'rectangle':
          drawRectangle(ctx, shape);
          break;
        case 'circle':
          drawCircle(ctx, shape);
          break;
        case 'text':
          return;
      }
    }
  };

  const addShape = (shape: Shape) => {
    setShapeList((prevShapes) => [...prevShapes, shape]);
  };

  const removeShape = (shape: Shape) => {
    setShapeList((prevShapes) =>
      prevShapes.filter((prevShape) => prevShape.id !== shape.id)
    );
  };

  const findShapeInCoordinates = (point: Point): Shape | undefined => {
    for (const shape of shapeList) {
      let isInside = false;
      switch (shape.type) {
        case 'arrow':
          isInside = checkInsideRotatedLine(shape, point, arrowHeadLength);
          break;
        case 'rectangle':
          isInside = checkInsideRectangle(shape, point);
          break;
        case 'circle':
          isInside = checkInsideCircle(shape, point);
          break;
        case 'text':
          return;
      }

      if (isInside) {
        return shape;
      }
    }
  };

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      if (!isEditMode) return;

      event.preventDefault();
      event.stopPropagation();

      const { canvas, ctx } = getCanvasContext();
      if (canvas && ctx) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (drawMode === 'draw') {
          setIsDrawing(true);
          setShapeStart({
            type: lineType,
            startX: x,
            startY: y,
            color: color,
          });
        } else if (drawMode === 'move' || drawMode === 'copy') {
          setIsDragging(true);
          const point: Point = { x, y };
          const shape = findShapeInCoordinates(point);
          if (shape) {
            if (drawMode === 'move') {
              setDraggingShape(shape);
              removeShape(shape);
            } else if (drawMode === 'copy') {
              setDraggingShape({ ...shape, id: generateShapeId() });
            }

            setCursorClickPoint(point);
          }
        }
      }
    },
    [canvasRef, isEditMode, lineType, color, drawMode]
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!isEditMode) return;

      const { canvas, ctx } = getCanvasContext();
      if (canvas && ctx) {
        const rect = canvas.getBoundingClientRect();
        const currentX = event.clientX - rect.left;
        const currentY = event.clientY - rect.top;

        if (drawMode === 'draw' && shapeStart) {
          setShapeInProgress({
            ...shapeStart,
            endX: currentX,
            endY: currentY,
            id: generateShapeId(),
          });
        } else if (
          (drawMode === 'move' || drawMode === 'copy') &&
          draggingShape &&
          isDragging
        ) {
          const deltaX = currentX - cursorClickPoint.x;
          const deltaY = currentY - cursorClickPoint.y;

          const newStartX = draggingShape.startX + deltaX;
          const newStartY = draggingShape.startY + deltaY;
          const newEndX = draggingShape.endX + deltaX;
          const newEndY = draggingShape.endY + deltaY;

          setDraggingShape({
            ...draggingShape,
            startX: newStartX,
            startY: newStartY,
            endX: newEndX,
            endY: newEndY,
          });

          setCursorClickPoint({ x: currentX, y: currentY });
        }
      }
    },
    [
      isEditMode,
      isDrawing,
      shapeStart,
      shapeInProgres,
      drawMode,
      draggingShape,
      cursorClickPoint,
    ]
  );

  const handleMouseUp = useCallback(
    (event: React.MouseEvent) => {
      setIsDrawing(false);
      setIsDragging(false);

      const { canvas, ctx } = getCanvasContext();
      if (canvas && ctx) {
        const rect = canvas.getBoundingClientRect();
        const currentX = event.clientX - rect.left;
        const currentY = event.clientY - rect.top;

        if (drawMode === 'draw' && shapeStart) {
          if (lineType === 'arrow') {
            const shape = {
              ...shapeStart,
              endX: currentX,
              endY: currentY,
              id: generateShapeId(),
            };
            addShape(shape);
          } else {
            const minX = Math.min(shapeStart.startX, currentX);
            const maxX = Math.max(shapeStart.startX, currentX);
            const minY = Math.min(shapeStart.startY, currentY);
            const maxY = Math.max(shapeStart.startY, currentY);

            const shape = {
              ...shapeStart,
              startX: minX,
              endX: maxX,
              startY: minY,
              endY: maxY,
              id: generateShapeId(),
            };
            addShape(shape);
          }
        } else if (
          (drawMode === 'move' || drawMode === 'copy') &&
          draggingShape
        ) {
          addShape(draggingShape);
        }

        setDraggingShape(undefined);
        setShapeStart(undefined);
        setShapeInProgress(undefined);
      }
    },
    [lineType, drawMode, shapeStart, draggingShape]
  );

  const handleUndo = useCallback(() => {
    setShapeList((prevShapes) => prevShapes.slice(0, -1));
  }, []);

  const clearStrokes = useCallback(
    (redrawCallback?: () => void) => {
      const { canvas, ctx } = getCanvasContext();

      if (canvas && ctx && selectedFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            if (redrawCallback) {
              redrawCallback();
            } else {
              setShapeList([]);
            }
          };
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(selectedFile);
      }
    },
    [canvasRef, selectedFile]
  );

  useEffect(() => {
    const redrawShapes = () => {
      const { canvas, ctx } = getCanvasContext();
      if (canvas && ctx) {
        shapeList.forEach((shape) => {
          draw(shape);
        });

        if (shapeInProgres) {
          draw(shapeInProgres);
        }

        if (draggingShape) {
          draw(draggingShape);
        }
      }
    };

    clearStrokes(redrawShapes);
  }, [shapeList, clearStrokes, shapeInProgres, draggingShape]);

  const emptyStrokes = shapeList.length === 0;

  const handleSetLineType = useCallback((value: string) => {
    if (['rectangle', 'arrow', 'circle', 'text'].includes(value)) {
      setLineType(value as LineType);

      if (value === 'text') {
        setCurrentText('');
      }
    }
  }, []);

  const handleSetDrawMode = (mode: string) => {
    if (['draw', 'move', 'copy'].includes(mode)) {
      setDrawMode(mode as DrawMode);
    }
  };

  const handleChangeColor = useCallback((color: string) => {
    if (/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(color)) {
      setColor(color);
    } else {
      setColor('#FF0000');
    }
  }, []);

  return {
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp,
    setLineType: handleSetLineType,
    lineType,
    setColor: handleChangeColor,
    color,
    setDrawMode: handleSetDrawMode,
    drawMode,
    clearStrokes,
    undo: handleUndo,
    emptyStrokes,
  };
};

export default useCanvasDrawing;
