import ConfirmModalButton from '@common/confirm-modal/ConfirmModalButton';
import TestlabDivider from '@common/divider/TestlabDivider';
import { ButtonSize, ButtonVariant } from '@common/types';
import {
  Button,
  Heading,
  Textarea,
  Textfield,
} from '@digdir/designsystemet-react';
import { MinusCircleIcon, PlusCircleIcon } from '@navikt/aksel-icons';

import classes from '../../kontroll.module.css';
import { SideListItem } from '../types';

interface Props {
  innhaldstypeLabel: string;
  sideList: SideListItem[];
  setExpanded: (value: string) => void;
  handleAddSide: () => void;
  handleRemoveSide: (key: string) => void;
  handleRemoveInnhaldstype: (typeId: number, egendefinertType?: string) => void;
}

const SideBegrunnelseForm = ({
  innhaldstypeLabel,
  sideList,
  handleAddSide,
  handleRemoveSide,
  handleRemoveInnhaldstype,
}: Props) => {
  const hasMultipleItems = sideList.length > 1;
  const isForside = innhaldstypeLabel.toLowerCase() === 'forside';
  const side = sideList[0];

  return (
    <>
      <Heading size="xsmall" level={5} spacing>
        Legg til {innhaldstypeLabel}
      </Heading>

      {sideList.map((side, index) => {
        return (
          <div
            key={`${side.typeId}_${index}`}
            className={classes.begrunnelseInputs}
          >
            <Textarea
              label="Begrunnelse for sideutval"
              value={
                side?.begrunnelse?.length !== 0 ? side?.begrunnelse : undefined
              }
              // name={begrunnelseKey}
              // id={begrunnelseKey}
            />
            <Textfield
              label="Url"
              value={side?.url?.length !== 0 ? side?.url : undefined}
              type="url"
              // name={urlKey}
              // id={urlKey}
            />
            {hasMultipleItems && (
              <div className={classes.taBortSideWrapper}>
                <Button
                  size={ButtonSize.Small}
                  variant={ButtonVariant.Quiet}
                  type="button"
                  onClick={() => handleRemoveSide(side.key)}
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
          onConfirm={() =>
            handleRemoveInnhaldstype(side.typeId, side.egendefinertType)
          }
          buttonIcon={<MinusCircleIcon />}
        />
        <Button
          size={ButtonSize.Small}
          variant={ButtonVariant.Quiet}
          type="button"
          onClick={handleAddSide}
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
