import ConfirmModalButton from '@common/confirm-modal/ConfirmModalButton';
import CircleIcon from '@common/icon/CircleIcon';
import SquareIcon from '@common/icon/SquareIcon';
import { LineType } from '@common/image-edit/types';
import { ButtonVariant } from '@common/types';
import { Button, ToggleGroup } from '@digdir/design-system-react';
import {
  ArrowUndoIcon,
  ArrowUpIcon,
  EraserIcon,
  FloppydiskIcon,
  PencilLineIcon,
  TrashIcon,
} from '@navikt/aksel-icons';

interface Props {
  show: boolean;
  isEditMode: boolean;
  emptyHistory: boolean;
  handleClearCanvas: () => void;
  handleClearStrokes: () => void;
  toggleImageSize: () => void;
  handleUndo: () => void;
  handleSetLineType: (lineType: string) => void;
  lineType: LineType;
  handleChangeColor: (color: string) => void;
  color: string;
}

const ImageEditControls = ({
  show,
  isEditMode,
  emptyHistory,
  handleClearCanvas,
  handleClearStrokes,
  toggleImageSize,
  handleUndo,
  handleSetLineType,
  lineType,
  handleChangeColor,
  color,
}: Props) => {
  if (!show) {
    return null;
  }

  const onChangeColor = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChangeColor(event.target.value);
  };

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
            disabled={emptyHistory}
            iconOnly={true}
            variant={ButtonVariant.Quiet}
          />
          <Button
            onClick={handleUndo}
            title="Tilbake"
            icon={<ArrowUndoIcon />}
            variant={ButtonVariant.Quiet}
            disabled={emptyHistory}
          />
          <ToggleGroup
            defaultValue={lineType}
            onChange={handleSetLineType}
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
