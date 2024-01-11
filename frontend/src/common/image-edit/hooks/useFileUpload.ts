import { Severity } from '@common/types';
import { useCallback, useState } from 'react';

interface UseFileUploadProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  setAlert: (severity: Severity, message: string) => void;
}

const useFileUpload = ({ canvasRef, setAlert }: UseFileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleClearFile = () => setSelectedFile(null);

  const handleSelectFile = useCallback(
    (file: File) => {
      setIsDragOver(false);

      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/bmp'];
      if (!allowedMimeTypes.includes(file.type)) {
        setAlert('danger', 'Feil filformat');
        return;
      }

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d', { willReadFrequently: true });
      if (ctx && canvas) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (canvas) {
            const img = new Image();
            img.onload = () => {
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
      } else {
        setAlert('danger', 'Kunne ikkje prosessere bilete');
      }
    },
    [canvasRef, setIsDragOver, setAlert]
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length === 1) {
      handleSelectFile(event.target.files[0]);
    } else {
      setAlert('danger', 'Feil i opplasting av fil');
    }
  };

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (event.dataTransfer.files.length === 1) {
        handleSelectFile(event.dataTransfer.files[0]);
      } else {
        setAlert('danger', 'Feil i opplasting av fil');
      }
    },
    [canvasRef, setAlert]
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

  return {
    handleFileChange,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    selectedFile,
    isDragOver,
    handleClearFile,
  };
};

export default useFileUpload;
