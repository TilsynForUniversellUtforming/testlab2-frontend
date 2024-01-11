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
  toggleImageSize: () => void;
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
  toggleImageSize,
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

      {isEditMode && (
        <>
          <ToggleGroup value={drawMode} onChange={setDrawMode} size="small">
            <ToggleGroup.Item value="draw" icon={<PencilIcon />} title="Tekn" />
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
            <ToggleGroup value={lineType} onChange={setLineType} size="small">
              <ToggleGroup.Item
                value="line"
                icon={<MinusIcon />}
                title="Linje"
              />
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
            <ToggleGroup value={textStyle} onChange={setTextStyle} size="small">
              <ToggleGroup.Item
                value="filled"
                icon={
                  <TextStyleIcon selected={textStyle === 'filled'} filled />
                }
                title="Fylt"
              />
              <ToggleGroup.Item
                value="outline"
                icon={<TextStyleIcon selected={textStyle === 'outline'} />}
                title="Omriss"
              />
              <ToggleGroup.Item
                value="none"
                icon={
                  <TextStyleIcon selected={textStyle === 'none'} onlyText />
                }
                title="Ingen"
              />
            </ToggleGroup>
          )}
        </>
      )}
    </div>
  );
};

export default ImageControl;
