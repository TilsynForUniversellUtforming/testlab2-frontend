import ConfirmModalButton from '@common/confirm-modal/ConfirmModalButton';
import TestlabDivider from '@common/divider/TestlabDivider';
import { ButtonSize, ButtonVariant } from '@common/types';
import { Button, Heading, Textarea, Textfield, } from '@digdir/designsystemet-react';
import { MinusCircleIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import { UseFormRegister } from 'react-hook-form';

import classes from '../../kontroll.module.css';
import { SideutvalForm, SideutvalIndexed } from '../types';

interface Props {
  innhaldstypeLabel: string;
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
  innhaldstypeLabel,
  sideutvalIndexedList,
  handleAddSide,
  handleRemoveSide,
  register,
}: Props) => {
  const hasMultipleItems = sideutvalIndexedList.length > 1;
  const isForside = innhaldstypeLabel.toLowerCase() === 'forside';
  const defaultSide = sideutvalIndexedList[0].sideutval;

  const handleRemoveInnhaldstype = () => {
    if (isForside) {
      return;
    }

    const { loeysingId, typeId, egendefinertType } = defaultSide;

    if (!loeysingId) {
      throw Error('Ugyldig løysing');
    }

    if (!typeId) {
      throw Error('Ugyldig innhaldstype');
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
        Legg til {innhaldstypeLabel}
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
              {...register(`sideutval.${index}.egendefinertType` as const, {
                required: true,
              })}
              defaultValue={side.egendefinertType}
            />
            <Textarea
              label="Begrunnelse for sideutval"
              defaultValue={side.begrunnelse}
              {...register(`sideutval.${index}.begrunnelse` as const, {
                required: true,
              })}
            />
            <Textfield
              label="Url"
              defaultValue={side.url}
              type="url"
              {...register(`sideutval.${index}.url` as const, {
                required: true,
              })}
            />
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
              : `Fjern innhaldstype ${innhaldstypeLabel}`
          }
          disabled={isForside}
          message="Vil du ta bort hele innhaldstypen? Dette kan ikkje angrast"
          onConfirm={handleRemoveInnhaldstype}
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
          Legg til fleire sider innan {innhaldstypeLabel}
        </Button>
        <TestlabDivider />
        <Button size={ButtonSize.Small}>Lagre {innhaldstypeLabel}</Button>
      </div>
    </>
  );
};

export default SideBegrunnelseForm;
