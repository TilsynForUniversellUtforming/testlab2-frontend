import {
  drawArrow,
  drawCircle,
  drawRectangle,
} from '@common/image-edit/canvasShapes';
import { LineType, Position } from '@common/image-edit/types';
import React, { useCallback, useEffect, useState } from 'react';

interface UseCanvasDrawingProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isEditMode: boolean;
  selectedFile: File | null;
}

interface UseCanvasDrawingReturnType {
  handleMouseDown: (event: React.MouseEvent) => void;
  handleMouseMove: (event: React.MouseEvent) => void;
  handleMouseUp: () => void;
  handleSetLineType: (lineType: string) => void;
  lineType: LineType;
  handleChangeColor: (color: string) => void;
  color: string;
  clearStrokes: () => void;
  handleUndo: () => void;
  emptyImageHistory: boolean;
}

const defaultStartPosition: Position = { x: 0, y: 0 };

const useCanvasDrawing = ({
  canvasRef,
  isEditMode,
  selectedFile,
}: UseCanvasDrawingProps): UseCanvasDrawingReturnType => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startX, setStartX] = useState<number>(0);
  const [startY, setStartY] = useState<number>(0);
  const [imgData, setImgData] = useState<ImageData>();
  const [textPosition, setTextPosition] =
    useState<Position>(defaultStartPosition);
  const [currentText, setCurrentText] = useState<string>('');
  const [imageHistory, setImageHistory] = useState<ImageData[]>([]);
  const [lineType, setLineType] = useState<LineType>('arrow');
  const [color, setColor] = useState<string>('#ff0000');

  const getCanvasContext = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    return { canvas, ctx };
  };

  useEffect(() => {
    if (!selectedFile) {
      setImageHistory([]);
      setCurrentText('');
      setImgData(undefined);
      setTextPosition(defaultStartPosition);
    }
  }, [selectedFile]);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, currentX: number, currentY: number) => {
      if (!startX || !startY) {
        return;
      }

      switch (lineType) {
        case 'arrow':
          drawArrow(ctx, startX, startY, currentX, currentY, color);
          break;
        case 'rectangle':
          drawRectangle(ctx, startX, startY, currentX, currentY, color);
          break;
        case 'circle':
          drawCircle(ctx, startX, startY, currentX, currentY, color);
          break;
        case 'text':
          return;
      }
    },
    [startX, startY, lineType, color]
  );

  const saveToHistory = (ctx: CanvasRenderingContext2D) => {
    setImageHistory((prevHistory) => [
      ...prevHistory,
      ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height),
    ]);
  };

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      if (!isEditMode) return;

      const { canvas, ctx } = getCanvasContext();
      if (canvas && ctx) {
        setIsDrawing(true);
        const rect = canvas.getBoundingClientRect();
        setStartX(event.clientX - rect.left);
        setStartY(event.clientY - rect.top);
        setImgData(ctx.getImageData(0, 0, canvas.width, canvas.height));

        if (lineType === 'text') {
          const nextTextPosition: Position = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          };
          setTextPosition(nextTextPosition);
          setCurrentText('');
        }
      }
    },
    [canvasRef, isEditMode, lineType]
  );

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
    const { canvas, ctx } = getCanvasContext();
    if (canvas && ctx) {
      setImgData(ctx.getImageData(0, 0, canvas.width, canvas.height));
      if (lineType !== 'text') {
        saveToHistory(ctx);
      }
    }
  }, [canvasRef, lineType]);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!isDrawing) return;

      const { canvas, ctx } = getCanvasContext();
      if (canvas && ctx && imgData) {
        const rect = canvas.getBoundingClientRect();
        const currentX = event.clientX - rect.left;
        const currentY = event.clientY - rect.top;

        ctx.putImageData(imgData, 0, 0);
        draw(ctx, currentX, currentY);
      }
    },
    [isDrawing, imgData, draw, canvasRef]
  );

  const clearStrokes = useCallback(() => {
    const canvas = canvasRef?.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });

    if (imageHistory.length > 0) {
      setImageHistory([]);
    }

    if (canvas && ctx && selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(selectedFile);
    }
  }, [canvasRef, selectedFile, imageHistory]);

  const handleUndo = useCallback(() => {
    const newHistory = [...imageHistory];
    if (newHistory.length > 0) {
      newHistory.pop();
      const { canvas, ctx } = getCanvasContext();
      if (canvas && ctx) {
        if (newHistory.length > 0) {
          const previousState = newHistory[newHistory.length - 1];
          ctx.putImageData(previousState, 0, 0);
          setImageHistory(newHistory);
        } else {
          clearStrokes();
        }
      }
    }
  }, [imageHistory]);

  useEffect(() => {
    const isTextMode = lineType === 'text';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isTextMode) return;

      if (event.key === 'Backspace') {
        setCurrentText((prevText) => prevText.slice(0, -1));
        handleUndo();
      } else if (event.key.length === 1) {
        const nextText = currentText + event.key;
        setCurrentText(nextText);
        const paddedDrawText = ` ${nextText} `;
        drawText(paddedDrawText);
      }
    };

    const drawText = (text: string) => {
      const { canvas, ctx } = getCanvasContext();
      if (ctx && canvas) {
        const textHeight = 24;
        const textWidth = ctx.measureText(text).width;
        const correctedTextWidth =
          textWidth <= textHeight ? textHeight : textWidth;

        ctx.fillStyle = 'white';
        ctx.fillRect(
          textPosition.x,
          textPosition.y - textHeight,
          correctedTextWidth,
          textHeight * 1.3
        );

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(
          textPosition.x,
          textPosition.y - textHeight,
          correctedTextWidth,
          textHeight * 1.3
        );

        ctx.font = '24px Arial';
        ctx.fillStyle = color;
        ctx.fillText(text, textPosition.x, textPosition.y);

        saveToHistory(ctx);
      }
    };

    if (isTextMode) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lineType, currentText, textPosition, canvasRef, handleUndo, color]);

  const emptyImageHistory = imageHistory.length === 0;

  const handleSetLineType = useCallback((value: string) => {
    if (['rectangle', 'arrow', 'circle', 'text'].includes(value)) {
      setLineType(value as LineType);

      if (value === 'text') {
        setCurrentText('');
      }
    }
  }, []);

  const handleChangeColor = useCallback((color: string) => {
    if (/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(color)) {
      setColor(color);
    } else {
      setColor('#FF0000');
    }
  }, []);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleSetLineType,
    lineType,
    handleChangeColor,
    color,
    clearStrokes,
    handleUndo,
    emptyImageHistory,
  };
};

export default useCanvasDrawing;
