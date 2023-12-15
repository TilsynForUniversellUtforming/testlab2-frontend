import ArrowIcon from '@common/icon/ArrowIcon';
import CircleIcon from '@common/icon/CircleIcon';
import SquareIcon from '@common/icon/SquareIcon';
import { DrawMode, LineType } from '@common/image-edit/types';
import { ToggleGroup } from '@digdir/design-system-react';
import {
  EraserIcon,
  FingerButtonIcon,
  PencilIcon,
  TabsIcon,
} from '@navikt/aksel-icons';

interface Props {
  show: boolean;
  setLineType: (lineType: string) => void;
  lineType: LineType;
  setDrawMode: (drawMode: string) => void;
  drawMode: DrawMode;
}

const CanvasDrawingControls = ({
  show,
  setLineType,
  lineType,
  setDrawMode,
  drawMode,
}: Props) => {
  if (!show) {
    return null;
  }

  return (
    <div className="image-upload-user-actions canvas">
      <ToggleGroup defaultValue={drawMode} onChange={setDrawMode} size="small">
        <ToggleGroup.Item value="draw" icon={<PencilIcon />} title="Tekn" />
        <ToggleGroup.Item
          value="move"
          icon={<FingerButtonIcon />}
          title="Flytt"
        />
        <ToggleGroup.Item value="copy" icon={<TabsIcon />} title="Kopier" />
        <ToggleGroup.Item value="erase" icon={<EraserIcon />} title="Visk ut" />
      </ToggleGroup>
      {drawMode === 'draw' && (
        <ToggleGroup
          defaultValue={lineType}
          onChange={setLineType}
          size="small"
        >
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
          <ToggleGroup.Item value="text" title="Tekstmodus">
            Aa
          </ToggleGroup.Item>
        </ToggleGroup>
      )}
    </div>
  );
};

export default CanvasDrawingControls;
