import AlertTimed from '@common/alert/AlertTimed';
import useAlert from '@common/alert/useAlert';
import { ButtonVariant } from '@common/types';
import { getFullPath, idPath, IdReplacement } from '@common/util/routeUtils';
import { Button, Heading, Tag } from '@digdir/designsystemet-react';
import { createTestresultatAggregert } from '@resultat/resultat-api';
import { TESTRESULTAT_TESTGRUNNLAG } from '@resultat/ResultatRoutes';
import { TestContext } from '@test/types';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

const TestFerdig = () => {
  const { contextSak }: TestContext = useOutletContext();
  const { id: sakId, loeysingId, testgrunnlagId: testgrunnlagId } = useParams();
  const navigate = useNavigate();
  const [loeysingNamn, setLoeysingNamn] = useState<string>('');
  const [alert, setAlert] = useAlert();

  const onFerdigTest = useCallback(async () => {
    await createTestresultatAggregert(Number(testgrunnlagId))
      .then(() => {
        navigate(
          getFullPath(TESTRESULTAT_TESTGRUNNLAG, {
            pathParam: idPath,
            id: testgrunnlagId,
          } as IdReplacement)
        );
      })
      .catch((error) => {
        console.error(error);
        setAlert('danger', 'Kunne ikke lagre aggregert testresultat');
      });
  }, [sakId]);

  useEffect(() => {
    const foundLoeysing = contextSak?.loeysingList.find(
      (l) => l.loeysing.id === Number(loeysingId)
    );
    if (foundLoeysing) {
      setLoeysingNamn(foundLoeysing.loeysing.namn);
    }
  }, [loeysingId, contextSak?.loeysingList]);

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
