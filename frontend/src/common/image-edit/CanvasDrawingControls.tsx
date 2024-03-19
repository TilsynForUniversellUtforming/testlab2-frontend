import ArrowIcon from '@common/icon/ArrowIcon';
import CircleIcon from '@common/icon/CircleIcon';
import SquareIcon from '@common/icon/SquareIcon';
import TextStyleIcon from '@common/icon/TextStyleIcon';
import { DrawMode, LineType, TextStyle } from '@common/image-edit/types';
import { ButtonVariant } from '@common/types';
import { Button, ToggleGroup } from '@digdir/designsystemet-react';
import {
  EraserIcon,
  FingerButtonIcon,
  MinusIcon,
  PencilIcon,
  TabsIcon,
  XMarkIcon,
} from '@navikt/aksel-icons';

interface Props {
  setLineType: (lineType: string) => void;
  lineType: LineType;
  setDrawMode: (drawMode: string) => void;
  drawMode: DrawMode;
  setTextStyle: (textStyle: string) => void;
  textStyle: TextStyle;
  hideContextMenu: () => void;
}

const CanvasDrawingControls = ({
  setLineType,
  lineType,
  setDrawMode,
  drawMode,
  setTextStyle,
  textStyle,
  hideContextMenu,
}: Props) => (
  <div className="image-upload-user-actions canvas">
    <ToggleGroup defaultValue={drawMode} onChange={setDrawMode}>
      <ToggleGroup.Item value="draw" icon={true} title="Tekn">
        <PencilIcon />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="text" title="Tekstmodus">
        Aa
      </ToggleGroup.Item>
      <ToggleGroup.Item value="move" icon={true} title="Flytt">
        <FingerButtonIcon />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="copy" icon={true} title="Kopier">
        <TabsIcon />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="erase" icon={true} title="Visk ut">
        <EraserIcon />
      </ToggleGroup.Item>
    </ToggleGroup>
    {drawMode === 'draw' && (
      <ToggleGroup defaultValue={lineType} onChange={setLineType}>
        <ToggleGroup.Item value="line" icon={true} title="Linje">
          <MinusIcon />
        </ToggleGroup.Item>
        <ToggleGroup.Item value="arrow" icon={true} title="Pil">
          <ArrowIcon selected={lineType === 'arrow'} />
        </ToggleGroup.Item>
        <ToggleGroup.Item value="rectangle" icon={true} title="Rektangel">
          <SquareIcon selected={lineType === 'rectangle'} />
        </ToggleGroup.Item>
        <ToggleGroup.Item value="circle" icon={true} title="Ellipse">
          <CircleIcon selected={lineType === 'circle'} />
        </ToggleGroup.Item>
      </ToggleGroup>
    )}
    {drawMode === 'text' && (
      <ToggleGroup defaultValue={textStyle} onChange={setTextStyle}>
        <ToggleGroup.Item value="filled" icon={true} title="Fylt">
          <TextStyleIcon selected={textStyle === 'filled'} filled />
        </ToggleGroup.Item>
        <ToggleGroup.Item value="outline" icon={true} title="Omriss">
          <TextStyleIcon selected={textStyle === 'outline'} />
        </ToggleGroup.Item>
        <ToggleGroup.Item value="none" icon={true} title="Ingen">
          <TextStyleIcon selected={textStyle === 'none'} onlyText />
        </ToggleGroup.Item>
      </ToggleGroup>
    )}
    <Button
      size="small"
      title="Lukk"
      onClick={hideContextMenu}
      icon
      variant={ButtonVariant.Quiet}
    >
      <XMarkIcon />
    </Button>
  </div>
);

export default CanvasDrawingControls;
