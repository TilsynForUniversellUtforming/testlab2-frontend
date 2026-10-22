import TestlabDivider from '@common/divider/TestlabDivider';
import { ButtonVariant } from '@common/types';
import { Button } from '@digdir/designsystemet-react';
import TestForm from '@test/testregel-form/TestForm';
import TestFormForenklaList from '@test/testregel-form/testform-forenkla/TestFormForenklaList';
import { ActiveTest, TestResultUpdate } from '@test/types';
import classNames from 'classnames';

interface Props {
  activeTest: ActiveTest | undefined;
  isManuell: boolean;
  isForenkla: boolean;
  isAutomatisk: boolean;
  showHelpText: boolean;
  loading: boolean;
  onResultat: (testResultUpdate: TestResultUpdate) => void;
  onSlettTestelement: (resultatId: number) => void;
  leggTilFlereTestelementer: () => void;
  onClickSave: () => void;
  testregelListLength: number;
}

const LoeysingTestForm = ({
  activeTest,
  isManuell,
  isForenkla,
  isAutomatisk,
  showHelpText,
  loading,
  onResultat,
  onSlettTestelement,
  leggTilFlereTestelementer,
  onClickSave,
  testregelListLength,
}: Props) => {
  if (!activeTest) {
    return null;
  }

  return (
    <main
      className={classNames('testregel-form-wrapper', {
        single: testregelListLength === 1,
      })}
    >
      {isManuell && (
        <TestForm
          testregel={activeTest.testregel}
          resultater={activeTest.testResultList}
          onResultat={onResultat}
          showHelpText={showHelpText}
          slettTestelement={onSlettTestelement}
          isLoading={loading}
        />
      )}
      {(isForenkla || isAutomatisk) && (
        <TestFormForenklaList
          testregel={activeTest.testregel}
          resultater={activeTest.testResultList}
          showHelpText={true}
          onResultat={onResultat}
          slettTestelement={onSlettTestelement}
          isLoading={false}
          isDemoApp={false}
        />
      )}
      <TestlabDivider />
      <div className="testregel-form-button-wrapper">
        <div className="testregel-form-buttons">
          <Button
            variant={ButtonVariant.Outline}
            onClick={leggTilFlereTestelementer}
          >
            Legg til flere testelementer
          </Button>
          <Button onClick={onClickSave}>Lagre og lukk</Button>
        </div>
      </div>
    </main>
  );
};

export default LoeysingTestForm;
