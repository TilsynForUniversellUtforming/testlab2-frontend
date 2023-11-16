import ConditionalComponentContainer from '@common/ConditionalComponentContainer';
import TestlabDivider from '@common/divider/TestlabDivider';
import { ButtonSize, ButtonVariant } from '@common/types';
import { isValidObject } from '@common/util/validationUtils';
import { Button, Heading, Paragraph } from '@digdir/design-system-react';
import LoeysingRelationList from '@sak/form/steps/init/inngaaende/verksemd-loeysing/LoeysingRelationList';
import VerksemdLoeysingRelationForm from '@sak/form/steps/init/inngaaende/verksemd-loeysing/VerksemdLoeysingRelationForm';
import { SakVerksemdLoeysingRelation } from '@sak/types';
import { useEffect, useState } from 'react';

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

  return (
    <>
      <TestlabDivider size="large" />
      <Heading size="small" level={5} spacing>
        Utvalde nettløysingar
      </Heading>
      <Paragraph size="small" spacing>
        Du kan velja kva nettløysingar du vil testa på. Du kan velja så mange du
        vil, av både mobil og nettstader.
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
    </>
  );
};

export default VerksemdLoeysingRelationWrapper;
