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
  ExpandIcon,
  ShrinkIcon,
  TrashIcon,
} from '@navikt/aksel-icons';

interface Props {
  show: boolean;
  isImageFullSize: boolean;
  emptyHistory: boolean;
  handleClearCanvas: () => void;
  handleClearStrokes: () => void;
  toggleImageSize: () => void;
  handleUndo: () => void;
  handleSetLineType: (lineType: string) => void;
  lineType: LineType;
}

const ImageEditControls = ({
  show,
  isImageFullSize,
  emptyHistory,
  handleClearCanvas,
  handleClearStrokes,
  toggleImageSize,
  handleUndo,
  handleSetLineType,
  lineType,
}: Props) => {
  if (!show) {
    return null;
  }

  return (
    <div className="image-upload-user-actions">
      <ConfirmModalButton
        title="Slett bilde"
        message="Vil du ta slette biletet? Dette kan ikkje angrast"
        icon={<TrashIcon />}
        onConfirm={handleClearCanvas}
        iconOnly={true}
        variant={ButtonVariant.Quiet}
      />
      <Button
        onClick={toggleImageSize}
        title={isImageFullSize ? 'Minimer' : 'Utvid'}
        icon={isImageFullSize ? <ShrinkIcon /> : <ExpandIcon />}
        variant={ButtonVariant.Quiet}
      />
      <ConfirmModalButton
        title="Fjern tegning"
        message="Vil du fjerne alle tegninger? Dette kan ikkje angrast"
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
        defaultValue="arrow"
        onChange={handleSetLineType}
        size="small"
      >
        <ToggleGroup.Item
          value="arrow"
          icon={<ArrowUpIcon />}
          title="Teikn pil"
          disabled={!isImageFullSize}
        />
        <ToggleGroup.Item
          value="rectangle"
          icon={<SquareIcon selected={lineType === 'rectangle'} />}
          title="Teikn firkant"
          disabled={!isImageFullSize}
        />
        <ToggleGroup.Item
          value="circle"
          icon={<CircleIcon selected={lineType === 'circle'} />}
          title="Teikn sirkel"
          disabled={!isImageFullSize}
        />
        <ToggleGroup.Item
          value="text"
          title="Tekst"
          disabled={!isImageFullSize}
        >
          Aa
        </ToggleGroup.Item>
      </ToggleGroup>
    </div>
  );
};

export default ImageEditControls;
