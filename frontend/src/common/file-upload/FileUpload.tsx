// FileUpload.tsx
import './file-upload.scss';

import { Paragraph } from '@digdir/design-system-react';
import { UploadIcon } from '@navikt/aksel-icons';
import classnames from 'classnames';
import React, { useCallback, useRef, useState } from 'react';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && event.dataTransfer.files) {
      const file = event.dataTransfer.files[0];
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (canvas) {
          const img = new Image();
          img.onload = () => {
            const maxWidth = 32 * 16;
            const scale = Math.min(1, maxWidth / img.width);
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;

            canvas.width = scaledWidth;
            canvas.height = scaledHeight;

            ctx.clearRect(0, 0, scaledWidth, scaledHeight);
            ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
          };
          img.src = e.target?.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }, []);

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

  return (
    <div
      className="file-drop-container"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div
        className={classnames('file-upload-instructions', {
          file: !!selectedFile,
          'drag-over': isDragOver,
        })}
      >
        <canvas
          ref={canvasRef}
          className={classnames('file-upload-canvas', {
            hidden: !selectedFile,
          })}
        />
        {!selectedFile && (
          <>
            <UploadIcon title="Last opp" fontSize={42} />
            <Paragraph>Dra og slepp eller leit etter fil</Paragraph>
            <Paragraph>Filformater: .jpg, .png, og .bmp</Paragraph>
          </>
        )}
      </div>
      <Paragraph size="small">Antall filer {selectedFile ? 1 : 0}/1</Paragraph>
    </div>
  );
};

export default FileUpload;
