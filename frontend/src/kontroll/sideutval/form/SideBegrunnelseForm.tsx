import { sanitizeEnumLabel } from '@common/util/stringutils';
import classes from '../../kontroll.module.css';
import { ButtonSize, ButtonVariant } from '@common/types';
import ConfirmModalButton from '@common/confirm-modal/ConfirmModalButton';
import TestlabDivider from '@common/divider/TestlabDivider';
import { FormFieldKey, InnhaldstypeKontroll, SideListItem } from '../types';
import { Button, Heading, Textarea, Textfield } from '@digdir/designsystemet-react';
import { MinusCircleIcon, PlusCircleIcon } from '@navikt/aksel-icons';


interface Props {
  type: InnhaldstypeKontroll;
  sideBegrunnelseList: SideListItem[];
  setExpanded: (value: string) => void;
  handleAddSide: () => void;
  handleRemoveSide: (key: string) => void;
  handleRemoveInnhaldstype: (
    innhaldstype: string,
    egendefinertType: string | undefined
  ) => void;
}


const SideBegrunnelseForm = ({
  type,
  sideBegrunnelseList,
  handleAddSide,
  handleRemoveSide,
  handleRemoveInnhaldstype,
}: Props) => {
  const hasMultipleItems = sideBegrunnelseList.length > 1;
  const innhaldstype = type.innhaldstype;
  const isForside = innhaldstype.toLowerCase() === 'forside';
  const innhaldstypeLabel = sanitizeEnumLabel(
    type.egendefinertType || innhaldstype
  );

  return (
    <>
      <Heading size="xsmall" level={5} spacing>
        Legg til {innhaldstypeLabel}
      </Heading>

      {sideBegrunnelseList.map((sideBegrunnelse) => {
        const begrunnelseKey: FormFieldKey = `${sideBegrunnelse.key}_begrunnelse`;
        const urlKey: FormFieldKey = `${sideBegrunnelse.key}_url`;

        return (
          <div key={sideBegrunnelse.key} className={classes.begrunnelseInputs}>
            <Textarea
              label="Begrunnelse for sideutval"
              value={
                sideBegrunnelse?.begrunnelse?.length !== 0
                  ? sideBegrunnelse?.begrunnelse
                  : undefined
              }
              name={begrunnelseKey}
              id={begrunnelseKey}
            />
            <Textfield
              label="Url"
              value={
                sideBegrunnelse?.url?.length !== 0
                  ? sideBegrunnelse?.url
                  : undefined
              }
              type="url"
              name={urlKey}
              id={urlKey}
            />
            {hasMultipleItems && (
              <div className={classes.taBortSideWrapper}>
                <Button
                  size={ButtonSize.Small}
                  variant={ButtonVariant.Quiet}
                  type="button"
                  onClick={() => handleRemoveSide(sideBegrunnelse.key)}
                  className={classes.taBortSide}
                >
                  <MinusCircleIcon/>
                  Ta bort side
                </Button>
              </div>
            )}
          </div>
        )
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
          message='Vil du ta bort hele innhaldstypen? Dette kan ikkje angrast'
          onConfirm={() =>
            handleRemoveInnhaldstype(innhaldstype, type.egendefinertType)
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