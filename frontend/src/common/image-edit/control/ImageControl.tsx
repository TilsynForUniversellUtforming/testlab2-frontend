import ConfirmModalButton from '@common/confirm-modal/ConfirmModalButton';
import { ButtonVariant } from '@common/types';
import { Button } from '@digdir/design-system-react';
import {
  ArrowUndoIcon,
  DocPencilIcon,
  FloppydiskIcon,
  TrashIcon,
  XMarkIcon,
} from '@navikt/aksel-icons';

interface Props {
  show: boolean;
  isEditMode: boolean;
  emptyStrokes: boolean;
  handleClearCanvas: () => void;
  handleClearStrokes: () => void;
  toggleImageSize: () => void;
  handleUndo: () => void;
  setColor: (event: React.ChangeEvent<HTMLInputElement>) => void;
  color: string;
}

const ImageControl = ({
  show,
  isEditMode,
  emptyStrokes,
  handleClearCanvas,
  handleClearStrokes,
  toggleImageSize,
  handleUndo,
  setColor,
  color,
}: Props) => {
  if (!show) {
    return null;
  }

  return (
    <div className="image-upload-user-actions canvas-control">
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
        icon={isEditMode ? <FloppydiskIcon /> : <DocPencilIcon />}
        variant={ButtonVariant.Quiet}
      />
      {isEditMode && (
        <>
          <ConfirmModalButton
            title="Nullstill"
            message="Vil du nullstille markeringar? Dette kan ikkje angrast"
            icon={<XMarkIcon />}
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
          <input
            type="color"
            id="farge"
            className="farge"
            value={color}
            onChange={setColor}
            title="Farge"
          />
        </>
      )}
    </div>
  );
};

export default ImageControl;
