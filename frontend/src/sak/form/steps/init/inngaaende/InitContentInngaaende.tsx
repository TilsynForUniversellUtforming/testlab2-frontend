import TestlabDivider from '@common/divider/TestlabDivider';
import TestlabFormAutocomplete from '@common/form/autocomplete/TestlabFormAutocomplete';
import { ButtonSize, ButtonVariant } from '@common/types';
import { Button, Chip, Heading, Paragraph } from '@digdir/design-system-react';
import { Loeysing } from '@loeysingar/api/types';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import SakVerksemdResult from '@sak/form/steps/init/inngaaende/SakVerksemdResult';
import VerksemdLoeysingRelationForm from '@sak/form/steps/init/inngaaende/verksemd-loeysing-relation/VerksemdLoeysingRelationForm';
import useLoeysingAutocomplete from '@sak/hooks/useLoeysingAutocomplete';
import { SakFormState, SakVerksemdLoeysingRelation } from '@sak/types';
import { getVerksemdLoeysingRelations_dummy } from '@verksemder/api/verksemd-api';
import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

const InitContentInngaaende = () => {
  const [loadingRelations, setLoadingRelations] = useState(false);
  const [errorMessageRelations, setErrorMessageRelations] = useState<string>();
  const [showManualLoeysingRelation, setShowManualLoeysingRelation] =
    useState(false);
  const [noVerksemdLoeysingRelations, setNoVerksemdLoeysingRelations] =
    useState(false);

  const { control, setValue } = useFormContext<SakFormState>();
  const verksemdLoeysingRelation = useWatch<SakFormState>({
    control,
    name: 'verksemdLoeysingRelation',
  }) as SakVerksemdLoeysingRelation | undefined;

  const {
    verksemdAutocompleteList,
    onChangeAutocomplete,
    verksemdNotFound,
    errorMessage,
  } = useLoeysingAutocomplete();

  useEffect(() => {
    const noVerksemdLoeysingRelations =
      verksemdLoeysingRelation?.loeysingList.filter((l) => l.loeysing.id > 0)
        .length === 0;
    setNoVerksemdLoeysingRelations(noVerksemdLoeysingRelations);
  }, [verksemdLoeysingRelation?.loeysingList]);

  const handleGetVerksemdLoeysingRelations = async (verksemd: Loeysing) => {
    setErrorMessageRelations(undefined);
    setLoadingRelations(true);

    const doGetVerksemdLoeysingRelations = async (verksemd: Loeysing) => {
      try {
        return await getVerksemdLoeysingRelations_dummy(verksemd);
      } catch (e) {
        setErrorMessageRelations(
          'Kunne ikkje henta kopling mellom verksemd og løysingar'
        );
      }
    };

    return doGetVerksemdLoeysingRelations(verksemd).finally(() =>
      setLoadingRelations(false)
    );
  };

  const onClick = useCallback((verksemd: Loeysing) => {
    setValue('verksemdLoeysingRelation.verksemd', verksemd);
    handleGetVerksemdLoeysingRelations(verksemd).then(
      (verksemdLoeysingRelationList) => {
        if (verksemdLoeysingRelationList) {
          setValue(
            'verksemdLoeysingRelation.loeysingList',
            verksemdLoeysingRelationList.map((loeysing) => ({
              loeysing: loeysing,
              forside: undefined,
              navigasjonsmeny: undefined,
              bilder: undefined,
              overskrifter: undefined,
              artikkel: undefined,
              skjema: undefined,
              tabell: undefined,
              knapper: undefined,
            }))
          );
        }
      }
    );
  }, []);

  return (
    <>
      <TestlabFormAutocomplete<SakFormState, Loeysing>
        label="Navn på testobjekt"
        description="Søk etter virksomhetsnavn eller orgnr."
        resultList={verksemdAutocompleteList}
        resultLabelKey="namn"
        resultDescriptionKey="orgnummer"
        onChange={onChangeAutocomplete}
        onClick={onClick}
        retainValueOnClick={false}
        name="verksemdLoeysingRelation.verksemd"
        customError={errorMessage}
        required
        spacing
      />
      <SakVerksemdResult
        verksemd={verksemdLoeysingRelation?.verksemd}
        manualVerksemd={verksemdLoeysingRelation?.manualVerksemd}
        verksemdNotFound={verksemdNotFound}
        loading={loadingRelations}
        errorMessageRelations={errorMessageRelations}
      />
      {(verksemdNotFound || verksemdLoeysingRelation?.verksemd) && (
        <>
          <TestlabDivider size="large" />
          <Heading size="small" level={5} spacing>
            Utvalgte nettsteder
          </Heading>
          {noVerksemdLoeysingRelations && (
            <Paragraph size="small">
              Det kom ingen utvalgte nettsteder med i søket. Legg inn navn på
              virksomheter, underenheter eller digitale verktøy som skal være en
              del av denne testen. Sideutvalg gjøres på et senere tidspunkt
            </Paragraph>
          )}
          <div className="sak-loeysing__inngaaende-selection">
            {verksemdLoeysingRelation?.loeysingList?.map((loeysingRelation) => {
              if (!loeysingRelation?.loeysing?.namn) {
                return null;
              }

              return (
                <Chip.Toggle key={loeysingRelation.loeysing.id}>
                  {loeysingRelation.loeysing.namn}
                </Chip.Toggle>
              );
            })}
          </div>
          {!(showManualLoeysingRelation || noVerksemdLoeysingRelations) && (
            <Button
              size={ButtonSize.Small}
              variant={ButtonVariant.Quiet}
              type="button"
              onClick={() => setShowManualLoeysingRelation(true)}
              icon={<PlusCircleIcon />}
            >
              Legg til løsning
            </Button>
          )}
          {(showManualLoeysingRelation || noVerksemdLoeysingRelations) && (
            <VerksemdLoeysingRelationForm />
          )}
        </>
      )}
    </>
  );
};

export default InitContentInngaaende;
