import './file-upload.scss';

import CircleIcon from '@common/icon/CircleIcon';
import SquareIcon from '@common/icon/SquareIcon';
import { ButtonVariant } from '@common/types';
import { Button, Paragraph, ToggleGroup } from '@digdir/design-system-react';
import {
  ArrowUndoIcon,
  EraserIcon,
  ExpandIcon,
  ShrinkIcon,
  TrashIcon,
  TrendFlatIcon,
  UploadIcon,
} from '@navikt/aksel-icons';
import classnames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export type LineType = 'rectangle' | 'arrow' | 'line' | 'circle' | 'text';

export type Position = { x: number; y: number };

export type History = { imageData: ImageData; isText: boolean };

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isImageFullSize, setIsImageFullSize] = useState(true);
  const [lineType, setLineType] = useState<LineType>('arrow');
  const [isDrawing, setIsDrawing] = useState(false);
  const [startX, setStartX] = useState<number>(0);
  const [startY, setStartY] = useState<number>(0);
  const [imgData, setImgData] = useState<ImageData>();
  const [textPosition, setTextPosition] = useState<Position>({ x: 0, y: 0 });
  const [currentText, setCurrentText] = useState('');
  const [history, setHistory] = useState<History[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d', { willReadFrequently: true });
      if (ctx && event.dataTransfer.files) {
        const file = event.dataTransfer.files[0];
        setSelectedFile(file);

        const reader = new FileReader();
        reader.onload = (e) => {
          if (canvas) {
            const img = new Image();
            img.onload = () => {
              let canvasWidth, canvasHeight;

              if (isImageFullSize) {
                canvasWidth = img.width;
                canvasHeight = img.height;
              } else {
                // Scale down the image
                const maxWidth = 32 * 16;
                const scale = Math.min(1, maxWidth / img.width);
                canvasWidth = img.width * scale;
                canvasHeight = img.height * scale;
              }

              canvas.width = canvasWidth;
              canvas.height = canvasHeight;

              ctx.clearRect(0, 0, canvasWidth, canvasHeight);
              ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
            };
            img.src = e.target?.result as string;
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [canvasRef, isImageFullSize]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(true);
    },
    []
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);
    },
    []
  );

  const handleMouseDown = (event: React.MouseEvent) => {
    if (isImageFullSize) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d', { willReadFrequently: true });

      if (canvas && ctx) {
        setIsDrawing(true);
        const rect = canvas.getBoundingClientRect();
        setStartX(event.clientX - rect.left);
        setStartY(event.clientY - rect.top);
        setImgData(ctx.getImageData(0, 0, canvas.width, canvas.height));
        if (lineType === 'text') {
          setCurrentText('');
          setTextPosition({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          });
        }
      }
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (canvas && ctx) {
      setImgData(ctx.getImageData(0, 0, canvas.width, canvas.height));
      saveToHistory(ctx, false);
    }
  };

  const handleDrawing = useCallback(
    (event: React.MouseEvent) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d', { willReadFrequently: true });

      if (isDrawing && canvas && ctx && imgData && startX && startY) {
        const rect = canvas.getBoundingClientRect();
        const currentX = event.clientX - rect.left;
        const currentY = event.clientY - rect.top;

        ctx.putImageData(imgData, 0, 0);
        ctx.beginPath();
        if (lineType === 'arrow') {
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
        } else if (lineType === 'rectangle') {
          ctx.rect(startX, startY, currentX - startX, currentY - startY);
          ctx.stroke();
        } else if (lineType === 'circle') {
          const radiusX = Math.abs(currentX - startX) / 2;
          const radiusY = Math.abs(currentY - startY) / 2;
          const centerX = startX + (currentX - startX) / 2;
          const centerY = startY + (currentY - startY) / 2;

          ctx.beginPath();
          ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'red';
        ctx.stroke();
      }
    },
    [isDrawing, canvasRef]
  );

  const handleClearCanvas = () => {
    setSelectedFile(null);
  };

  const toggleImageSize = () => {
    setIsImageFullSize((prev) => !prev);
  };

  const handleSetLineType = (value: string) => {
    if (['rectangle', 'arrow', 'line', 'circle', 'text'].includes(value)) {
      setLineType(value as LineType);

      if (value === 'text') {
        setCurrentText('');
      }
    }
  };

  useEffect(() => {
    const isTextMode = lineType === 'text';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTextMode) {
        if (event.key === 'Backspace') {
          setCurrentText((prevText) => prevText.slice(0, -1));
          handleUndo();
        } else if (event.key.length === 1) {
          setCurrentText((prevText) => prevText + event.key);
          const canvas = canvasRef?.current;
          const ctx = canvas?.getContext('2d', { willReadFrequently: true });
          if (ctx) {
            saveToHistory(ctx, true);
          }
        }
      }
    };

    if (isTextMode) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lineType]);

  useEffect(() => {
    const isTextMode = lineType === 'text';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTextMode) {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        if (event.key === 'Backspace') {
          setCurrentText((prevText) => prevText.slice(0, -1));
          handleUndo();
        } else if (event.key.length === 1) {
          setCurrentText((prevText) => prevText + event.key);
          ctx.font = '24px Arial';
          ctx.fillStyle = 'red';
          ctx.fillText(
            event.key,
            textPosition.x + ctx.measureText(currentText).width,
            textPosition.y
          );
        }
      }
    };

    if (isTextMode) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lineType, currentText, textPosition]);

  useEffect(() => {
    if (lineType === 'text' && currentText) {
      const canvas = canvasRef?.current;
      const ctx = canvas?.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        const newText = ` ${currentText} `;
        const textWidth = ctx.measureText(newText).width;
        const textHeight = 24;
        ctx.fillStyle = 'white';
        ctx.fillRect(
          textPosition.x,
          textPosition.y - textHeight,
          textWidth,
          textHeight * 1.5
        );

        ctx.font = '24px Arial';
        ctx.fillStyle = 'red';

        ctx.fillText(newText, textPosition.x, textPosition.y);
      }
    }
  }, [currentText, textPosition, lineType]);

  const clearStrokes = () => {
    const canvas = canvasRef?.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });

    if (history.length > 0) {
      setHistory([]);
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
  };

  const saveToHistory = (ctx: CanvasRenderingContext2D, isText: boolean) => {
    setHistory((prevHistory) => [
      ...prevHistory,
      {
        imageData: ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height),
        isText,
      },
    ]);
  };

  const handleUndo = () => {
    setHistory((prevHistory) => {
      const newHistory = [...prevHistory];
      if (newHistory.length > 0) {
        newHistory.pop();
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d', { willReadFrequently: true });
        if (canvas && ctx && newHistory.length > 0) {
          const previousState = newHistory[newHistory.length - 1];
          ctx.putImageData(previousState.imageData, 0, 0);
        }
      }
      return newHistory;
    });
  };

  return (
    <div className="file-upload-container">
      <div
        className="file-upload"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {selectedFile && (
          <div className="file-upload-user-actions">
            <Button
              onClick={handleClearCanvas}
              title="Fjern bilde"
              icon={<TrashIcon />}
              variant={ButtonVariant.Quiet}
            />
            <Button
              onClick={toggleImageSize}
              title={isImageFullSize ? 'Minimer' : 'Full storleik'}
              icon={isImageFullSize ? <ShrinkIcon /> : <ExpandIcon />}
              variant={ButtonVariant.Quiet}
            />
          </div>
        )}
        <div
          className={classnames('file-upload-instructions', {
            file: selectedFile,
            'drag-over': isDragOver,
          })}
        >
          <canvas
            ref={canvasRef}
            className={classnames('file-upload-canvas', {
              hidden: !selectedFile,
              'full-size': isImageFullSize,
            })}
            onMouseDown={handleMouseDown}
            onMouseMove={handleDrawing}
            onMouseUp={handleMouseUp}
          />
          {!selectedFile && (
            <>
              <UploadIcon title="Last opp" fontSize={42} />
              <Paragraph>Dra og slepp eller leit etter fil</Paragraph>
              <Paragraph>Filformater: .jpg, .png, og .bmp</Paragraph>
            </>
          )}
        </div>
        <Paragraph size="small" spacing>
          Antall filer {selectedFile ? 1 : 0}/1
        </Paragraph>
        {selectedFile && (
          <div className="file-upload-user-actions">
            <Button
              onClick={clearStrokes}
              title="Fjern markeringer"
              icon={<EraserIcon />}
              variant={ButtonVariant.Quiet}
              disabled={!isImageFullSize}
            />
            <Button
              onClick={handleUndo}
              title="Tilbake"
              icon={<ArrowUndoIcon />}
              variant={ButtonVariant.Quiet}
              disabled={history.length === 0}
            />
            <ToggleGroup
              defaultValue={'arrow'}
              onChange={handleSetLineType}
              size="small"
            >
              <ToggleGroup.Item
                value="arrow"
                icon={<TrendFlatIcon />}
                title="Teikn pil"
                disabled={!isImageFullSize}
              />
              <ToggleGroup.Item
                value="rectangle"
                icon={<SquareIcon selected={lineType === 'rectangle'} />}
                title="Teikn firkant"
                disabled={!isImageFullSize}
              />
              <ToggleGroup.Item
                value="circle"
                icon={<CircleIcon selected={lineType === 'circle'} />}
                title="Teikn sirkel"
                disabled={!isImageFullSize}
              />
              <ToggleGroup.Item
                value="text"
                title="Tekst"
                disabled={!isImageFullSize}
              >
                Aa
              </ToggleGroup.Item>
            </ToggleGroup>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
