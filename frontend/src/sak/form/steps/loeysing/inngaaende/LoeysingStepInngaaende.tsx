import { isDefined } from '@common/util/validationUtils';
import { Chip, Heading, Paragraph } from '@digdir/designsystemet-react';
import { Loeysing } from '@loeysingar/api/types';
import LoeysingNettsideForm from '@sak/form/steps/loeysing/inngaaende/loeysing-nettside/LoeysingNettsideForm';
import { LoeysingNettsideRelation } from '@sak/types';
import { useState } from 'react';

interface Props {
  loeysingNettsideRelationList: LoeysingNettsideRelation[];
}

const LoeysingStepInngaaende = ({ loeysingNettsideRelationList }: Props) => {
  const [displayLoeysing, setDisplayLosying] = useState<Loeysing | undefined>();

  const toggleDisplayLoeysing = (loeysingId: number) => {
    if (displayLoeysing === undefined) {
      const loeysingNettsideRelation = loeysingNettsideRelationList.find(
        (l) => l.loeysing.id === loeysingId
      );
      setDisplayLosying(loeysingNettsideRelation?.loeysing);
    }
  };

  const onCloseLoeysing = () => {
    setDisplayLosying(undefined);
  };

  const loeysingIndexes = new Map(
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
            onClick={() => toggleDisplayLoeysing(loeysingRelation.loeysing.id)}
            selected={displayLoeysing?.id === loeysingRelation.loeysing.id}
            checkmark={false}
          >
            {loeysingRelation.loeysing.namn}
          </Chip.Toggle>
        ))}
      </div>
      {isDefined(displayLoeysing) && (
        <LoeysingNettsideForm
          heading={displayLoeysing?.namn}
          loeysingIndex={loeysingIndexes.get(displayLoeysing?.id) || 0}
          onClose={onCloseLoeysing}
        />
      )}
    </>
  );
};

export default LoeysingStepInngaaende;
