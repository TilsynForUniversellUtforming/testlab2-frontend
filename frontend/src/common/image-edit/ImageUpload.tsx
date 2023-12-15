import './image-upload.scss';

import AlertTimed from '@common/alert/AlertTimed';
import useAlert from '@common/alert/useAlert';
import CanvasDrawingControls from '@common/image-edit/CanvasDrawingControls';
import ImageControl from '@common/image-edit/control/ImageControl';
import useCanvasDrawing from '@common/image-edit/hooks/useCanvasDrawing';
import useFileUpload from '@common/image-edit/hooks/useFileUpload';
import { Paragraph } from '@digdir/design-system-react';
import { UploadIcon } from '@navikt/aksel-icons';
import classnames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

import { Point } from './types';

const ImageUpload = () => {
  const [isEditMode, setIsEditMode] = useState(true);
  const [alert, setAlert] = useAlert();
  const [contextMenuPosition, setContextMenuPosition] = useState<Point>({
    x: 0,
    y: 0,
  });
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    handleFileChange,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    selectedFile,
    isDragOver,
    handleClearFile,
  } = useFileUpload({ canvasRef, setAlert });

  const {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    setLineType,
    lineType,
    setColor,
    color,
    setDrawMode,
    drawMode,
    clearStrokes,
    undo,
    emptyStrokes,
  } = useCanvasDrawing(canvasRef, isEditMode, selectedFile, showContextMenu);

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  const handleContextMenu = (event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();

    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      setContextMenuPosition({ x, y });
      setShowContextMenu(true);
    }
  };

  const drawButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      if (
        !(
          drawButtonRef.current &&
          e.target instanceof Node &&
          drawButtonRef.current.contains(e.target)
        )
      ) {
        setShowContextMenu(false);
      }
    };

    window.addEventListener('click', (e) => handleClick(e));
    return () => {
      window.removeEventListener('click', (e) => handleClick(e));
    };
  }, [drawButtonRef]);

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
              'full-size': isEditMode,
              [drawMode]: drawMode,
            })}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onContextMenu={handleContextMenu}
          />
          {showContextMenu && (
            <div
              className="image-upload-canvas-control"
              style={{
                top: `${contextMenuPosition.y}px`,
                left: `${contextMenuPosition.x}px`,
              }}
            >
              <CanvasDrawingControls
                show={isEditMode}
                setLineType={setLineType}
                lineType={lineType}
                setDrawMode={setDrawMode}
                drawMode={drawMode}
                ref={drawButtonRef}
              />
            </div>
          )}
          {!selectedFile && (
            <>
              <UploadIcon title="Last opp" fontSize={42} />
              <Paragraph>
                Dra og slepp eller&nbsp;
                <label
                  htmlFor="file-upload"
                  className="image-upload-manual-link"
                >
                  leit etter fil
                </label>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  accept=".jpg,.png,.bmp"
                  className="image-upload-manual-input"
                />
              </Paragraph>
              <Paragraph>Filformater: .jpg og .png, og .bmp</Paragraph>
            </>
          )}
        </div>
        <Paragraph size="small" spacing>
          Antall filer {selectedFile ? 1 : 0}/1
        </Paragraph>
        <ImageControl
          show={!!selectedFile}
          isEditMode={isEditMode}
          emptyStrokes={emptyStrokes}
          handleClearCanvas={handleClearFile}
          handleClearStrokes={clearStrokes}
          toggleImageSize={toggleEditMode}
          handleUndo={undo}
          setColor={setColor}
          color={color}
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
