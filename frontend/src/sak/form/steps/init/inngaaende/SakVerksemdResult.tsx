import TestlabDivider from '@common/divider/TestlabDivider';
import { Alert, Heading, Spinner } from '@digdir/designsystemet-react';
import { Loeysing } from '@loeysingar/api/types';
import SakVerksemdManualEntry from '@sak/form/steps/init/inngaaende/SakVerksemdManualEntry';

interface Props {
  verksemd?: Loeysing;
  showManualEntry: boolean;
  loading: boolean;
  errorMessageRelations?: string;
}

const SakVerksemdResult = ({
  verksemd,
  showManualEntry,
  loading,
  errorMessageRelations,
}: Props) => {
  if (errorMessageRelations) {
    return <Alert severity="danger">{errorMessageRelations}</Alert>;
  }

  if (loading) {
    return <Spinner title="Hentar relasjonar" />;
  }

  if (showManualEntry) {
    return <SakVerksemdManualEntry />;
  }

  if (!verksemd) {
    return null;
  }

  return (
    <>
      <TestlabDivider size="large" />
      <div className="sak-init__verksemd-result">
        <Heading level={2} size="medium">
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
    </>
  );
};

export default SakVerksemdResult;
