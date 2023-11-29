import ConditionalComponentContainer from '@common/ConditionalComponentContainer';
import TestlabDivider from '@common/divider/TestlabDivider';
import { getErrorMessage } from '@common/form/util';
import { ButtonSize, ButtonVariant } from '@common/types';
import { isValidObject } from '@common/util/validationUtils';
import {
  Button,
  ErrorMessage,
  Heading,
  Paragraph,
} from '@digdir/design-system-react';
import LoeysingRelationList from '@sak/form/steps/init/inngaaende/verksemd-loeysing/LoeysingRelationList';
import VerksemdLoeysingRelationForm from '@sak/form/steps/init/inngaaende/verksemd-loeysing/VerksemdLoeysingRelationForm';
import { SakFormState, SakVerksemdLoeysingRelation } from '@sak/types';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface Props {
  verksemdLoeysingRelation?: SakVerksemdLoeysingRelation;
  verksemdNotFound: boolean;
  noVerksemdLoeysingRelations: boolean;
}

const VerksemdLoeysingRelationWrapper = ({
  verksemdLoeysingRelation,
  verksemdNotFound,
  noVerksemdLoeysingRelations,
}: Props) => {
  const [showManualLoeysingRelation, setShowManualLoeysingRelation] =
    useState<boolean>(noVerksemdLoeysingRelations);

  const { formState } = useFormContext<SakFormState>();

  useEffect(() => {
    setShowManualLoeysingRelation(noVerksemdLoeysingRelations);
  }, [noVerksemdLoeysingRelations]);

  if (
    !verksemdNotFound &&
    !verksemdLoeysingRelation?.verksemd &&
    !isValidObject(verksemdLoeysingRelation?.manualVerksemd)
  ) {
    return null;
  }

  const listError = getErrorMessage(
    formState,
    'verksemdLoeysingRelation.loeysingList'
  );

  return (
    <>
      <TestlabDivider size="large" />
      <Heading size="medium" level={2} spacing>
        Utvalde nettløysingar
      </Heading>
      <Paragraph size="small" spacing>
        Vel kva nettløysingar du vil testa på. Du må velja men minst ein, men
        kan vejla så mange du vil av både mobil og nettstader. Du kan også
        leggja til fleira manuelt.
        {noVerksemdLoeysingRelations && (
          <>
            <br />
            Det kom ingen utvalgte nettsteder med i søket. Legg inn navn på
            virksomheter, underenheter eller digitale verktøy som skal være en
            del av denne testen. Sideutvalg gjøres på et senere tidspunkt
          </>
        )}
      </Paragraph>
      <LoeysingRelationList
        loeysingList={verksemdLoeysingRelation?.loeysingList}
      />
      <ConditionalComponentContainer
        condition={showManualLoeysingRelation}
        conditionalComponent={<VerksemdLoeysingRelationForm />}
        otherComponent={
          <Button
            size={ButtonSize.Small}
            variant={ButtonVariant.Outline}
            type="button"
            onClick={() => setShowManualLoeysingRelation(true)}
          >
            Legg til manuelt
          </Button>
        }
      />
      {!showManualLoeysingRelation && listError && (
        <ErrorMessage>{listError}</ErrorMessage>
      )}
    </>
  );
};

export default VerksemdLoeysingRelationWrapper;
