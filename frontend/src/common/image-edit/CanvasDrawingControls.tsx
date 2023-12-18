import ArrowIcon from '@common/icon/ArrowIcon';
import CircleIcon from '@common/icon/CircleIcon';
import SquareIcon from '@common/icon/SquareIcon';
import TextStyleIcon from '@common/icon/TextStyleIcon';
import { DrawMode, LineType, TextStyle } from '@common/image-edit/types';
import { ToggleGroup } from '@digdir/design-system-react';
import {
  EraserIcon,
  FingerButtonIcon,
  MinusIcon,
  PencilIcon,
  TabsIcon,
} from '@navikt/aksel-icons';
import { forwardRef } from 'react';

interface Props {
  show: boolean;
  setLineType: (lineType: string) => void;
  lineType: LineType;
  setDrawMode: (drawMode: string) => void;
  drawMode: DrawMode;
  setTextStyle: (textStyle: string) => void;
  textStyle: TextStyle;
}

const CanvasDrawingControls = forwardRef<HTMLButtonElement, Props>(
  (
    {
      show,
      setLineType,
      lineType,
      setDrawMode,
      drawMode,
      setTextStyle,
      textStyle,
    },
    drawButtonRef
  ) => {
    if (!show) {
      return null;
    }

    return (
      <div className="image-upload-user-actions canvas">
        <ToggleGroup defaultValue={drawMode} onChange={setDrawMode}>
          <ToggleGroup.Item
            value="draw"
            icon={<PencilIcon />}
            title="Tekn"
            ref={drawButtonRef}
          />
          <ToggleGroup.Item value="text" title="Tekstmodus">
            Aa
          </ToggleGroup.Item>
          <ToggleGroup.Item
            value="move"
            icon={<FingerButtonIcon />}
            title="Flytt"
          />
          <ToggleGroup.Item value="copy" icon={<TabsIcon />} title="Kopier" />
          <ToggleGroup.Item
            value="erase"
            icon={<EraserIcon />}
            title="Visk ut"
          />
        </ToggleGroup>
        {drawMode === 'draw' && (
          <ToggleGroup defaultValue={lineType} onChange={setLineType}>
            <ToggleGroup.Item value="line" icon={<MinusIcon />} title="Linje" />
            <ToggleGroup.Item
              value="arrow"
              icon={<ArrowIcon selected={lineType === 'arrow'} />}
              title="Pil"
            />
            <ToggleGroup.Item
              value="rectangle"
              icon={<SquareIcon selected={lineType === 'rectangle'} />}
              title="Rektangel"
            />
            <ToggleGroup.Item
              value="circle"
              icon={<CircleIcon selected={lineType === 'circle'} />}
              title="Ellipse"
            />
          </ToggleGroup>
        )}
        {drawMode === 'text' && (
          <ToggleGroup defaultValue={textStyle} onChange={setTextStyle}>
            <ToggleGroup.Item
              value="filled"
              icon={<TextStyleIcon selected={textStyle === 'filled'} filled />}
              title="Fylt"
            />
            <ToggleGroup.Item
              value="outline"
              icon={<TextStyleIcon selected={textStyle === 'outline'} />}
              title="Omriss"
            />
            <ToggleGroup.Item
              value="none"
              icon={<TextStyleIcon selected={textStyle === 'none'} onlyText />}
              title="Ingen"
            />
          </ToggleGroup>
        )}
      </div>
    );
  }
);
CanvasDrawingControls.displayName = 'CanvasDrawingControls';

export default CanvasDrawingControls;
