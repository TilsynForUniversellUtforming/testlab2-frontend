import './image-upload.scss';

import AlertTimed from '@common/alert/AlertTimed';
import useAlert from '@common/alert/useAlert';
import ImageEditControls from '@common/image-edit/ImageEditControls';
import useCanvasDrawing from '@common/image-edit/useCanvasDrawing';
import useFileUpload from '@common/image-edit/useFileUpload';
import { Paragraph } from '@digdir/design-system-react';
import { UploadIcon } from '@navikt/aksel-icons';
import classnames from 'classnames';
import React, { useRef, useState } from 'react';

const ImageUpload = () => {
  const [isEditMode, setIsEditMode] = useState(true);
  const [alert, setAlert] = useAlert();

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
  } = useCanvasDrawing({ canvasRef, isEditMode, selectedFile });

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
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
              'full-size': isEditMode,
            })}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
          />
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
        <ImageEditControls
          show={!!selectedFile}
          isEditMode={isEditMode}
          emptyStrokes={emptyStrokes}
          handleClearCanvas={handleClearFile}
          handleClearStrokes={clearStrokes}
          toggleImageSize={toggleEditMode}
          handleUndo={undo}
          setLineType={setLineType}
          lineType={lineType}
          setColor={setColor}
          color={color}
          setDrawMode={setDrawMode}
          drawMode={drawMode}
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
