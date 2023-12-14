import ConfirmModalButton from '@common/confirm-modal/ConfirmModalButton';
import CircleIcon from '@common/icon/CircleIcon';
import SquareIcon from '@common/icon/SquareIcon';
import { DrawMode, LineType } from '@common/image-edit/types';
import { ButtonVariant } from '@common/types';
import { Button, ToggleGroup } from '@digdir/design-system-react';
import {
  ArrowUndoIcon,
  ArrowUpIcon,
  EraserIcon,
  FilesIcon,
  FloppydiskIcon,
  PencilIcon,
  PencilLineIcon,
  PushPinIcon,
  TrashIcon,
} from '@navikt/aksel-icons';

interface Props {
  show: boolean;
  isEditMode: boolean;
  emptyStrokes: boolean;
  handleClearCanvas: () => void;
  handleClearStrokes: () => void;
  toggleImageSize: () => void;
  handleUndo: () => void;
  setLineType: (lineType: string) => void;
  lineType: LineType;
  setColor: (color: string) => void;
  color: string;
  setDrawMode: (drawMode: string) => void;
  drawMode: DrawMode;
}

const ImageEditControls = ({
  show,
  isEditMode,
  emptyStrokes,
  handleClearCanvas,
  handleClearStrokes,
  toggleImageSize,
  handleUndo,
  setLineType,
  lineType,
  setColor,
  color,
  setDrawMode,
  drawMode,
}: Props) => {
  const onChangeColor = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value);
  };

  if (!show) {
    return null;
  }

  return (
    <div className="image-upload-user-actions">
      <ConfirmModalButton
        title="Slett"
        message="Vil du ta slette biletet? Dette kan ikkje angrast"
        icon={<TrashIcon />}
        onConfirm={handleClearCanvas}
        iconOnly={true}
        variant={ButtonVariant.Quiet}
      />
      <Button
        onClick={toggleImageSize}
        title={isEditMode ? 'Lagre' : 'Rediger'}
        icon={isEditMode ? <FloppydiskIcon /> : <PencilLineIcon />}
        variant={ButtonVariant.Quiet}
      />
      {isEditMode && (
        <>
          <ConfirmModalButton
            title="Nullstill"
            message="Vil du nullstille markeringar? Dette kan ikkje angrast"
            icon={<EraserIcon />}
            onConfirm={handleClearStrokes}
            disabled={emptyStrokes}
            iconOnly={true}
            variant={ButtonVariant.Quiet}
          />
          <Button
            onClick={handleUndo}
            title="Tilbake"
            icon={<ArrowUndoIcon />}
            variant={ButtonVariant.Quiet}
            disabled={emptyStrokes}
          />
          <ToggleGroup
            defaultValue={drawMode}
            onChange={setDrawMode}
            size="small"
          >
            <ToggleGroup.Item
              value="draw"
              icon={<PencilIcon />}
              title="Flytt"
            />
            <ToggleGroup.Item
              value="move"
              icon={<PushPinIcon />}
              title="Flytt"
            />
            <ToggleGroup.Item
              value="copy"
              icon={<FilesIcon />}
              title="Kopier"
            />
          </ToggleGroup>
          <ToggleGroup
            defaultValue={lineType}
            onChange={setLineType}
            size="small"
          >
            <ToggleGroup.Item
              value="arrow"
              icon={<ArrowUpIcon />}
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
          <input
            type="color"
            id="farge"
            className="farge"
            value={color}
            onChange={onChangeColor}
            title="Farge"
          />
        </>
      )}
    </div>
  );
};

export default ImageEditControls;
