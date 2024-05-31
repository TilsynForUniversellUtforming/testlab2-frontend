import AlertTimed from '@common/alert/AlertTimed';
import useAlert from '@common/alert/useAlert';
import { ButtonVariant } from '@common/types';
import { getFullPath, idPath, IdReplacement } from '@common/util/routeUtils';
import { Button, Heading, Tag } from '@digdir/designsystemet-react';
import { createTestresultatAggregert } from '@resultat/resultat-api';
import { TESTRESULTAT_LOEYSING } from '@resultat/ResultatRoutes';
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const TestFerdig = ({ loeysingNamn }: { loeysingNamn: string }) => {
  const { id, testgrunnlagId: testgrunnlagId } = useParams();
  const navigate = useNavigate();
  const [alert, setAlert] = useAlert();

  const onFerdigTest = useCallback(async () => {
    await createTestresultatAggregert(Number(testgrunnlagId))
      .then(() => {
        navigate(
          getFullPath(TESTRESULTAT_LOEYSING, {
            pathParam: idPath,
            id: testgrunnlagId,
          } as IdReplacement)
        );
      })
      .catch((error) => {
        console.error(error);
        setAlert('danger', 'Kunne ikke lagre aggregert testresultat');
      });
  }, [id]);

  return (
    <div className="statusFerdig">
      <div className={'test-param-selection'}>
        <Heading size="small" level={6}>
          Ferdig testa
        </Heading>
        <Tag color="success" size="medium">
          {loeysingNamn}
        </Tag>
        Du har no testa alle innholdstypar og alle sideutval for {loeysingNamn}.
      </div>
      <div className={'teststatus-buttons'}>
        <Button variant={ButtonVariant.Outline} onClick={onFerdigTest}>
          Sjå resultat
        </Button>
      </div>
      {alert && (
        <AlertTimed
          severity={alert.severity}
          message={alert.message}
          clearMessage={alert.clearMessage}
        />
      )}
    </div>
  );
};
export default TestFerdig;
