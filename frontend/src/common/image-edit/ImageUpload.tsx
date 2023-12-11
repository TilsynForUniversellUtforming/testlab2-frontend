import './image-upload.scss';

import AlertTimed from '@common/alert/AlertTimed';
import useAlert from '@common/alert/useAlert';
import ImageEditControls from '@common/image-edit/ImageEditControls';
import { Paragraph } from '@digdir/design-system-react';
import { UploadIcon } from '@navikt/aksel-icons';
import classnames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { LineType, Position } from './types';

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isImageFullSize, setIsImageFullSize] = useState(false);
  const [lineType, setLineType] = useState<LineType>('arrow');
  const [isDrawing, setIsDrawing] = useState(false);
  const [startX, setStartX] = useState<number>(0);
  const [startY, setStartY] = useState<number>(0);
  const [imgData, setImgData] = useState<ImageData>();
  const [textPosition, setTextPosition] = useState<Position>({ x: 0, y: 0 });
  const [currentText, setCurrentText] = useState('');
  const [history, setHistory] = useState<ImageData[]>([]);
  const [alert, setAlert] = useAlert();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d', { willReadFrequently: true });
      if (ctx && event.dataTransfer.files) {
        const file = event.dataTransfer.files[0];

        const reader = new FileReader();
        reader.onload = (e) => {
          if (canvas) {
            const img = new Image();
            img.onload = () => {
              const imageTooWide = img.width > window.screen.width * 0.8;
              const imageTooTall = img.height > window.screen.height * 0.8;
              if (imageTooWide || imageTooTall) {
                setAlert('danger', 'Bilete er for stort');
                setSelectedFile(null);
                return;
              }
              const canvasWidth = img.width;
              const canvasHeight = img.height;

              canvas.width = canvasWidth;
              canvas.height = canvasHeight;

              ctx.clearRect(0, 0, canvasWidth, canvasHeight);
              ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
              setSelectedFile(file);
            };
            img.src = e.target?.result as string;
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [canvasRef]
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
      saveToHistory(ctx);
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
            saveToHistory(ctx);
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

  const saveToHistory = (ctx: CanvasRenderingContext2D) => {
    setHistory((prevHistory) => [
      ...prevHistory,
      ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height),
    ]);
  };

  const handleUndo = () => {
    setHistory((prevHistory) => {
      const newHistory = [...prevHistory];
      if (newHistory.length > 0) {
        newHistory.pop();
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d', { willReadFrequently: true });
        if (canvas && ctx) {
          if (newHistory.length > 0) {
            const previousState = newHistory[newHistory.length - 1];
            ctx.putImageData(previousState, 0, 0);
          } else {
            clearStrokes();
          }
        }
      }
      return newHistory;
    });
  };

  return (
    <div className="image-upload-container">
      <div
        className="image-upload"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div
          className={classnames('image-upload-instructions', {
            file: selectedFile,
            'drag-over': isDragOver,
          })}
        >
          <canvas
            ref={canvasRef}
            className={classnames('image-upload-canvas', {
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
        <ImageEditControls
          show={!!selectedFile}
          isImageFullSize={isImageFullSize}
          emptyHistory={history.length === 0}
          handleClearCanvas={handleClearCanvas}
          handleClearStrokes={clearStrokes}
          toggleImageSize={toggleImageSize}
          handleUndo={handleUndo}
          handleSetLineType={handleSetLineType}
          lineType={lineType}
        />
      </div>
      {alert && (
        <AlertTimed
          severity={alert.severity}
          message={alert.message}
          clearMessage={alert.clearMessage}
        />
      )}
    </div>
  );
};

export default ImageUpload;
