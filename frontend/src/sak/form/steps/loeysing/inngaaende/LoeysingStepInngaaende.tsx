import {
  Accordion,
  Chip,
  ErrorMessage,
  Heading,
  Paragraph,
} from '@digdir/design-system-react';
import LoeysingNettsideForm from '@sak/form/steps/loeysing/inngaaende/loeysing-nettisde/LoeysingNettsideForm';
import { LoeysingNettsideRelation } from '@sak/types';
import { useState } from 'react';

interface Props {
  loeysingNettsideRelationList?: LoeysingNettsideRelation[];
}

const LoeysingStepInngaaende = ({ loeysingNettsideRelationList }: Props) => {
  if (!loeysingNettsideRelationList) {
    return <ErrorMessage>Noko gjekk gale</ErrorMessage>;
  }

  const [displayLoeysingIdList, setDisplayLoeysingIdList] = useState<number[]>(
    loeysingNettsideRelationList
      .filter((lnr) => lnr.properties.length > 0)
      .map((lnr) => lnr.loeysing.id)
  );

  const toggleDisplayLoesying = (loeysingId: number) => {
    if (!displayLoeysingIdList.includes(loeysingId)) {
      setDisplayLoeysingIdList([...displayLoeysingIdList, loeysingId]);
    } else {
      setDisplayLoeysingIdList(
        displayLoeysingIdList.filter((id) => id !== loeysingId)
      );
    }
  };

  const loesyingIndexes = new Map(
    loeysingNettsideRelationList.map((lnr, index) => [lnr.loeysing.id, index])
  );

  return (
    <>
      <Heading level={5} size="small" spacing>
        Utvalgte nettsteder
      </Heading>
      <Paragraph size="small">
        Valfritt steg kvar du kan leggja til sideutval for dei løysingane som
        skal vera med i testen. Vel frå lista med løysingar nedanfor ved å
        trykke på løsyinga.
      </Paragraph>
      <br />
      <div className="sak-loeysing__inngaaende-selection">
        {loeysingNettsideRelationList?.map((loeysingRelation) => (
          <Chip.Toggle
            key={loeysingRelation.loeysing.id}
            onClick={() => toggleDisplayLoesying(loeysingRelation.loeysing.id)}
            selected={displayLoeysingIdList.includes(
              loeysingRelation.loeysing.id
            )}
          >
            {loeysingRelation.loeysing.namn}
          </Chip.Toggle>
        ))}
      </div>
      {displayLoeysingIdList.length > 0 && (
        <Accordion border>
          {loeysingNettsideRelationList
            .filter((lnr) => displayLoeysingIdList.includes(lnr.loeysing.id))
            .map((lnr) => (
              <Accordion.Item key={lnr.loeysing.id} color="second">
                <Accordion.Header>{lnr.loeysing.namn}</Accordion.Header>
                <Accordion.Content>
                  <LoeysingNettsideForm
                    heading={lnr.loeysing?.namn}
                    loeysingIndex={loesyingIndexes.get(lnr.loeysing.id) || 0}
                  />
                </Accordion.Content>
              </Accordion.Item>
            ))}
        </Accordion>
      )}
    </>
  );
};

export default LoeysingStepInngaaende;
