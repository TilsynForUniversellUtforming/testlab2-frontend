import ConfirmModalButton from '@common/confirm-modal/ConfirmModalButton';
import TestlabDivider from '@common/divider/TestlabDivider';
import TestlabFormInput from '@common/form/TestlabFormInput';
import TestlabFormTextArea from '@common/form/TestlabFormTextArea';
import { ButtonSize, ButtonVariant } from '@common/types';
import { Button, Heading } from '@digdir/designsystemet-react';
import { MinusCircleIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import { UseFormRegister } from 'react-hook-form';

import classes from '../../kontroll.module.css';
import { SideutvalForm, SideutvalIndexed } from '../types';

interface Props {
  testobjektLabel: string;
  sideutvalIndexedList: SideutvalIndexed[];
  setExpanded: (value: string) => void;
  handleAddSide: (
    loeysingId: number,
    objektId: number,
    egendefinertObjekt?: string
  ) => void;
  handleRemoveSide: (indices: number[]) => void;
  register: UseFormRegister<SideutvalForm>;
}

const SideBegrunnelseForm = ({
  testobjektLabel,
  sideutvalIndexedList,
  handleAddSide,
  handleRemoveSide,
  register,
}: Props) => {
  const hasMultipleItems = sideutvalIndexedList.length > 1;
  const isForside = testobjektLabel.toLowerCase() === 'forside';
  const defaultSide = sideutvalIndexedList[0].sideutval;

  const handleRemoveTestobjekt = () => {
    if (isForside) {
      return;
    }

    const { loeysingId, objektId, egendefinertObjekt } = defaultSide;

    if (!loeysingId) {
      throw Error('Ugyldig løysing');
    }

    if (!objektId) {
      throw Error('Ugyldig testobjekt');
    }

    const indiciesToRemove = sideutvalIndexedList
      .filter(
        (field) =>
          field.sideutval.loeysingId === loeysingId &&
          field.sideutval.objektId === objektId &&
          (!egendefinertObjekt ||
            field.sideutval.egendefinertObjekt === egendefinertObjekt)
      )
      .map((field) => field.index);
    handleRemoveSide(indiciesToRemove);
  };

  return (
    <>
      <Heading size="xsmall" level={5} spacing>
        Legg til {testobjektLabel}
      </Heading>

      {sideutvalIndexedList.map((sideutvalIndexed) => {
        const side = sideutvalIndexed.sideutval;
        const index = sideutvalIndexed.index;

        return (
          <div
            key={`${side.objektId}_${index}`}
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
              defaultValue={side.objektId}
              {...register(`sideutval.${index}.objektId` as const, {
                required: true,
              })}
            />
            <input
              type="hidden"
              {...register(`sideutval.${index}.egendefinertObjekt` as const)}
              defaultValue={side.egendefinertObjekt}
            />
            <TestlabFormTextArea
              label="Begrunnelse for sideutval"
              name={`sideutval.${index}.begrunnelse`}
            />
            <TestlabFormInput
              label="Url"
              type="url"
              name={`sideutval.${index}.url`}
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
              : `Fjern testobjekt ${testobjektLabel}`
          }
          disabled={isForside}
          message="Vil du ta bort hele testobjektet? Dette kan ikkje angrast"
          onConfirm={handleRemoveTestobjekt}
          buttonIcon={<MinusCircleIcon />}
        />
        <Button
          size={ButtonSize.Small}
          variant={ButtonVariant.Quiet}
          type="button"
          onClick={() =>
            handleAddSide(
              defaultSide.loeysingId,
              defaultSide.objektId,
              defaultSide.egendefinertObjekt
            )
          }
        >
          <PlusCircleIcon />
          Legg til fleire sider innan {testobjektLabel}
        </Button>
        <TestlabDivider />
        <Button size={ButtonSize.Small}>Lagre {testobjektLabel}</Button>
      </div>
    </>
  );
};

export default SideBegrunnelseForm;
