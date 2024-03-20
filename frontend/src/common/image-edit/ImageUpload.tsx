import './image-upload.scss';

import AlertTimed from '@common/alert/AlertTimed';
import useAlert from '@common/alert/useAlert';
import CanvasDrawingControls from '@common/image-edit/CanvasDrawingControls';
import ImageControl from '@common/image-edit/control/ImageControl';
import useCanvasDrawing from '@common/image-edit/hooks/useCanvasDrawing';
import useFileUpload from '@common/image-edit/hooks/useFileUpload';
import { Paragraph } from '@digdir/designsystemet-react';
import { UploadIcon } from '@navikt/aksel-icons';
import { deleteBilde, getBilder, uploadBilde } from '@test/api/testing-api';
import { Bilde } from '@test/api/types';
import classnames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import ImageGallery from './ImageGallery';
import { Point } from './types';

const ImageUpload = ({ resultatId }: { resultatId: number }) => {
  const [alert, setAlert] = useAlert();
  const [contextMenuPosition, setContextMenuPosition] = useState<Point>({
    x: 0,
    y: 0,
  });
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const [imageUris, setImageUris] = useState<Bilde[]>([]);

  const {
    selectedFile,
    handleFileChange,
    handleDrop,
    handleDragOver,
    handleDragLeave,
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
    setTextStyle,
    textStyle,
    clearStrokes,
    undo,
    emptyStrokes,
  } = useCanvasDrawing(canvasRef, selectedFile, showContextMenu, () =>
    setShowContextMenu(false)
  );

  const fetchImageUris = useCallback(async () => {
    try {
      const imageUris = await getBilder(resultatId);
      setImageUris(imageUris);
    } catch (e) {
      setAlert('danger', 'Noko gjekk gale med henting av bilder');
    }
  }, [resultatId]);

  useEffect(() => {
    fetchImageUris();
  }, [resultatId]);

  const onClickSave = useCallback(async () => {
    if (!selectedFile || !canvasRef.current) return;

    try {
      const canvas = canvasRef.current;
      const filetype = selectedFile.type;
      const dataUrl = canvas.toDataURL(filetype);
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], selectedFile.name, { type: filetype });

      const imageUris = await uploadBilde(file, resultatId);
      handleClearFile();
      setImageUris(imageUris);
    } catch (error) {
      setAlert('danger', 'Noko gjekk gale med opplasting av biletet');
    }
  }, [selectedFile, canvasRef]);

  const handleContextMenu = (event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();

    const canvas = divRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      setContextMenuPosition({ x, y });
      setShowContextMenu(true);
    }
  };

  const onDeleteBilde = useCallback(
    async (bildeId: number) => {
      try {
        const imageUris = await deleteBilde(resultatId, bildeId);
        setImageUris(imageUris);
      } catch (e) {
        setAlert('danger', 'Noko gjekk gale med henting av bilder');
      }
    },
    [resultatId]
  );

  return (
    <div className="image-upload-container" ref={divRef}>
      {showContextMenu && (
        <div
          className="image-upload-canvas-control"
          style={{
            top: `${contextMenuPosition.y}px`,
            left: `${contextMenuPosition.x}px`,
          }}
        >
          <CanvasDrawingControls
            setLineType={setLineType}
            lineType={lineType}
            setDrawMode={setDrawMode}
            drawMode={drawMode}
            setTextStyle={setTextStyle}
            textStyle={textStyle}
            hideContextMenu={() => setShowContextMenu(false)}
          />
        </div>
      )}
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
            className={classnames('image-upload-canvas full-size', {
              hidden: !selectedFile,
              [drawMode]: drawMode,
            })}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onContextMenu={handleContextMenu}
          />
          {!selectedFile && (
            <>
              <UploadIcon title="Last opp" fontSize={42} />
              <div>
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
                  accept=".jpg,.jpeg,.png,.bmp"
                  className="image-upload-manual-input"
                />
              </div>
              <div>
                Filformater: .jpg, .jpeg, .png, og .bmp. Maks storleik er 2MB
              </div>
            </>
          )}
        </div>
        <Paragraph size="small" spacing>
          Antall filer {selectedFile ? 1 : 0}/1
        </Paragraph>
        <ImageControl
          show={!!selectedFile}
          emptyStrokes={emptyStrokes}
          handleClearCanvas={handleClearFile}
          handleClearStrokes={clearStrokes}
          onClickSave={onClickSave}
          handleUndo={undo}
          setColor={setColor}
          setLineType={setLineType}
          lineType={lineType}
          setDrawMode={setDrawMode}
          drawMode={drawMode}
          setTextStyle={setTextStyle}
          textStyle={textStyle}
          color={color}
        />
      </div>
      <ImageGallery bilder={imageUris} onDeleteBilde={onDeleteBilde} />
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
