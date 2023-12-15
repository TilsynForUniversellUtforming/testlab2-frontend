import { DrawMode, LineType } from '@common/image-edit/types';
import { useCallback, useState } from 'react';

const useImageControl = () => {
  const [lineType, setLineType] = useState<LineType>('rectangle');
  const [color, setColor] = useState<string>('#ff0000');
  const [drawMode, setDrawMode] = useState<DrawMode>('draw');

  const handleSetLineType = useCallback((value: string) => {
    if (['line', 'rectangle', 'arrow', 'circle', 'text'].includes(value)) {
      setLineType(value as LineType);
    }
  }, []);

  const handleSetDrawMode = useCallback((mode: string) => {
    if (['draw', 'move', 'copy', 'erase'].includes(mode)) {
      setDrawMode(mode as DrawMode);
    }
  }, []);

  const handleChangeColor = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const color = event.target.value;
      if (/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(color)) {
        setColor(color);
      } else {
        setColor('#FF0000');
      }
    },
    []
  );

  return {
    lineType,
    setLineType: handleSetLineType,
    color,
    setColor: handleChangeColor,
    drawMode,
    setDrawMode: handleSetDrawMode,
  };
};

export default useImageControl;
