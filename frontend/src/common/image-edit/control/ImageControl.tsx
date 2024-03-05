import ConfirmModalButton from '@common/confirm-modal/ConfirmModalButton';
import ArrowIcon from '@common/icon/ArrowIcon';
import CircleIcon from '@common/icon/CircleIcon';
import SquareIcon from '@common/icon/SquareIcon';
import TextStyleIcon from '@common/icon/TextStyleIcon';
import { DrawMode, LineType, TextStyle } from '@common/image-edit/types';
import { ButtonVariant } from '@common/types';
import { Button, ToggleGroup } from '@digdir/design-system-react';
import {
  ArrowUndoIcon,
  DocPencilIcon,
  EraserIcon,
  FingerButtonIcon,
  FloppydiskIcon,
  MinusIcon,
  PencilIcon,
  TabsIcon,
  TrashIcon,
  XMarkIcon,
} from '@navikt/aksel-icons';

interface Props {
  show: boolean;
  isEditMode: boolean;
  emptyStrokes: boolean;
  handleClearCanvas: () => void;
  handleClearStrokes: () => void;
  onClickSave: () => void;
  toggleEditMode: () => void;
  handleUndo: () => void;
  setColor: (event: React.ChangeEvent<HTMLInputElement>) => void;
  color: string;
  setLineType: (lineType: string) => void;
  lineType: LineType;
  setDrawMode: (drawMode: string) => void;
  drawMode: DrawMode;
  setTextStyle: (textStyle: string) => void;
  textStyle: TextStyle;
}

const ImageControl = ({
  show,
  isEditMode,
  emptyStrokes,
  handleClearCanvas,
  handleClearStrokes,
  onClickSave,
  toggleEditMode,
  handleUndo,
  setColor,
  color,
  setLineType,
  lineType,
  setDrawMode,
  drawMode,
  setTextStyle,
  textStyle,
}: Props) => {
  if (!show) {
    return null;
  }

  return (
    <div className="image-upload-user-actions image-control">
      <div className="image-actions">
        <ConfirmModalButton
          title="Slett"
          message="Vil du ta slette biletet? Dette kan ikkje angrast"
          icon={<TrashIcon />}
          onConfirm={handleClearCanvas}
          iconOnly={true}
          variant={ButtonVariant.Quiet}
        />
        <ConfirmModalButton
          title="Lagre"
          message="Vil du lagre biletet?"
          icon={<FloppydiskIcon />}
          onConfirm={onClickSave}
          iconOnly={true}
          variant={ButtonVariant.Quiet}
        />
        <Button
          onClick={toggleEditMode}
          title="Rediger"
          variant={ButtonVariant.Quiet}
        >
          <DocPencilIcon />
        </Button>
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
              icon={true}
              variant={ButtonVariant.Quiet}
              disabled={emptyStrokes}
            >
              <ArrowUndoIcon />
            </Button>
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

      {isEditMode && (
        <>
          <ToggleGroup value={drawMode} onChange={setDrawMode} size="small">
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
            <ToggleGroup value={lineType} onChange={setLineType} size="small">
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
            <ToggleGroup value={textStyle} onChange={setTextStyle} size="small">
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
        </>
      )}
    </div>
  );
};

export default ImageControl;
