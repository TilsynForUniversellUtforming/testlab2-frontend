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

import { LineType } from './types';

const ImageUpload = () => {
  const [isImageFullSize, setIsImageFullSize] = useState(true);
  const [lineType, setLineType] = useState<LineType>('arrow');
  const [alert, setAlert] = useAlert();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    handleSelectFile,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    selectedFile,
    isDragOver,
    handleClearFile,
  } = useFileUpload({ canvasRef, setAlert });
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    clearStrokes,
    handleUndo,
    clearText,
    emptyImageHistory,
  } = useCanvasDrawing({ canvasRef, lineType, isImageFullSize, selectedFile });

  const toggleImageSize = () => {
    setIsImageFullSize((prev) => !prev);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length === 1) {
      handleSelectFile(event.target.files[0]);
    } else {
      setAlert('danger', 'Feil i opplasting av fil');
    }
  };

  const handleSetLineType = (value: string) => {
    if (['rectangle', 'arrow', 'line', 'circle', 'text'].includes(value)) {
      setLineType(value as LineType);

      if (value === 'text') {
        clearText();
      }
    }
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
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
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
          emptyHistory={emptyImageHistory}
          handleClearCanvas={handleClearFile}
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
