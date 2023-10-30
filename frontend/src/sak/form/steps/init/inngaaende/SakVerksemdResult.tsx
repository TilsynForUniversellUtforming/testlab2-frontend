import { Heading } from '@digdir/design-system-react';
import { Loeysing } from '@loeysingar/api/types';

interface Props {
  verksemd?: Loeysing;
}

const SakVerksemdResult = ({ verksemd }: Props) => {
  if (!verksemd) {
    return null;
  }

  return (
    <div className="sak-init__verksemd-result">
      <Heading level={2} size="small">
        {verksemd.namn}
      </Heading>
      <div className="entry">
        <div className="label">Hentet fra:</div>
        <div className="value">Testlab</div>
      </div>
      <br />
      <div className="entry">
        <div className="label">Orgnr:</div>
        <div className="value">{verksemd.orgnummer}</div>
      </div>
      <div className="entry">
        <div className="label">Kontaktperson:</div>
        <div className="value">Person Test</div>
      </div>
      <div className="entry">
        <div className="label">Dagleg leder:</div>
        <div className="value">Test Person</div>
      </div>
      <div className="entry">
        <div className="label">Bransje:</div>
        <div className="value">Test-bransje</div>
      </div>
      <div className="entry">
        <div className="label">Næringskode:</div>
        <div className="value">00.0000 Test-næringskode</div>
      </div>
      <div className="entry">
        <div className="label">Sektorkode:</div>
        <div className="value">0000 Test-sektorkode</div>
      </div>
    </div>
  );
};

export default SakVerksemdResult;
