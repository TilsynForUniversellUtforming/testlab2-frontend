import ConfirmModalButton from '@common/confirm-modal/ConfirmModalButton';
import TestlabFormInput from '@common/form/TestlabFormInput';
import TestlabFormTextArea from '@common/form/TestlabFormTextArea';
import { ButtonSize, ButtonVariant } from '@common/types';
import { Button, Heading } from '@digdir/designsystemet-react';
import { MinusCircleIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import { UseFormRegister } from 'react-hook-form';

import classes from '../../kontroll.module.css';
import { SideutvalForm, SideutvalIndexed } from '../types';

interface Props {
  sideutvalTypeLabel: string;
  sideutvalIndexedList: SideutvalIndexed[];
  setExpanded: (value: string) => void;
  handleAddSide: (
    loeysingId: number,
    typeId: number,
    egendefinertType?: string
  ) => void;
  handleRemoveSide: (indices: number[]) => void;
  register: UseFormRegister<SideutvalForm>;
}

const SideBegrunnelseForm = ({
  sideutvalTypeLabel,
  sideutvalIndexedList,
  handleAddSide,
  handleRemoveSide,
  register,
}: Props) => {
  const hasMultipleItems = sideutvalIndexedList.length > 1;
  const isForside = sideutvalTypeLabel.toLowerCase() === 'forside';
  const defaultSide = sideutvalIndexedList[0].sideutval;

  const handleRemoveSideutvalType = () => {
    if (isForside) {
      return;
    }

    const { loeysingId, typeId, egendefinertType } = defaultSide;

    if (!loeysingId) {
      throw Error('Ugyldig løysing');
    }

    if (!typeId) {
      throw Error('Ugyldig sideutval type');
    }

    const indiciesToRemove = sideutvalIndexedList
      .filter(
        (field) =>
          field.sideutval.loeysingId === loeysingId &&
          field.sideutval.typeId === typeId &&
          (!egendefinertType ||
            field.sideutval.egendefinertType === egendefinertType)
      )
      .map((field) => field.index);
    handleRemoveSide(indiciesToRemove);
  };

  return (
    <>
      <Heading size="xsmall" level={5} spacing>
        Legg til {sideutvalTypeLabel}
      </Heading>

      {sideutvalIndexedList.map((sideutvalIndexed) => {
        const side = sideutvalIndexed.sideutval;
        const index = sideutvalIndexed.index;

        return (
          <div
            key={`${side.typeId}_${index}`}
            className={classes.begrunnelseInputs}
          >
            <input
              type="hidden"
              {...register(`sideutval.${index}.loeysingId` as const, {
                required: true,
              })}
              defaultValue={side.loeysingId}
            />
            <input
              type="hidden"
              defaultValue={side.typeId}
              {...register(`sideutval.${index}.typeId` as const, {
                required: true,
              })}
            />
            <input
              type="hidden"
              {...register(`sideutval.${index}.egendefinertType` as const)}
              defaultValue={side.egendefinertType}
            />
            <TestlabFormTextArea
              label="Begrunnelse for sideutval"
              name={`sideutval.${index}.begrunnelse`}
            />
            <TestlabFormInput label="Url" name={`sideutval.${index}.url`} />
            {hasMultipleItems && (
              <div className={classes.taBortSideWrapper}>
                <Button
                  size={ButtonSize.Small}
                  variant={ButtonVariant.Quiet}
                  type="button"
                  onClick={() => handleRemoveSide([index])}
                  className={classes.taBortSide}
                >
                  <MinusCircleIcon />
                  Ta bort side
                </Button>
              </div>
            )}
          </div>
        );
      })}
      <div className={classes.lagreSideutvalNettside}>
        <ConfirmModalButton
          size={ButtonSize.Small}
          variant={ButtonVariant.Quiet}
          type="button"
          title={
            isForside
              ? 'Forside er påkrevd'
              : `Ta bort sideutval for ${sideutvalTypeLabel}`
          }
          disabled={isForside}
          message={`Vil du ta bort hele sideutvalet for ${sideutvalTypeLabel}? Dette kan ikkje angrast`}
          onConfirm={handleRemoveSideutvalType}
          buttonIcon={<MinusCircleIcon />}
        />
        <Button
          size={ButtonSize.Small}
          variant={ButtonVariant.Quiet}
          type="button"
          onClick={() =>
            handleAddSide(
              defaultSide.loeysingId,
              defaultSide.typeId,
              defaultSide.egendefinertType
            )
          }
        >
          <PlusCircleIcon />
          Legg til fleire sider innan {sideutvalTypeLabel}
        </Button>
      </div>
    </>
  );
};

export default SideBegrunnelseForm;
