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

  const [displayLoeysingList, setDisplayLoeysingList] = useState<number[]>([]);

  const toggleDisplayLoesying = (loeysingId: number) => {
    if (!displayLoeysingList.includes(loeysingId)) {
      setDisplayLoeysingList([...displayLoeysingList, loeysingId]);
    } else {
      setDisplayLoeysingList(
        displayLoeysingList.filter((id) => id !== loeysingId)
      );
    }
  };

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
            selected={displayLoeysingList.includes(
              loeysingRelation.loeysing.id
            )}
          >
            {loeysingRelation.loeysing.namn}
          </Chip.Toggle>
        ))}
      </div>
      {displayLoeysingList.length > 0 && (
        <Accordion border>
          {loeysingNettsideRelationList
            .filter((lnr) => displayLoeysingList.includes(lnr.loeysing.id))
            .map((lnr, index) => (
              <Accordion.Item key={lnr.loeysing.id} color="second">
                <Accordion.Header>{lnr.loeysing.namn}</Accordion.Header>
                <Accordion.Content>
                  <LoeysingNettsideForm
                    heading={lnr.loeysing?.namn}
                    loeysingIndex={index}
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
