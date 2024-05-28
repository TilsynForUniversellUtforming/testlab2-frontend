import AlertTimed from '@common/alert/AlertTimed';
import useAlert from '@common/alert/useAlert';
import { getFullPath, idPath } from '@common/util/routeUtils';
import { TestgrunnlagListElement } from '@test/api/types';
import TestLoeysingButton from '@test/test-overview/TestLoeysingButton';
import { TEST_LOEYSING_KONTROLL } from '@test/TestingRoutes';
import { TestContextKontroll } from '@test/types';
import { useCallback } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

const TestOverview = () => {
  const { id } = useParams();
  const { contextKontroll, testgrunnlag }: TestContextKontroll =
    useOutletContext();
  const navigate = useNavigate();
  const [alert, setAlert] = useAlert();

  const onChangeLoeysing = useCallback(
    async (testgrunnlag: TestgrunnlagListElement) => {
      const loeysing = contextKontroll.loeysingList.find(
        (l) => l.id === testgrunnlag.loeysingId
      );
      if (!loeysing || !id) {
        setAlert('danger', 'Det oppstod ein feil ved ending av løysing');
      } else {
        navigate(
          getFullPath(
            TEST_LOEYSING_KONTROLL,
            { pathParam: idPath, id: id },
            {
              pathParam: ':loeysingId',
              id: String(testgrunnlag.loeysingId),
            },
            { pathParam: ':testgrunnlagId', id: String(testgrunnlag.id) }
          )
        );
      }
    },
    [contextKontroll.loeysingList, testgrunnlag, id, navigate, setAlert]
  );

  return (
    <div className="manual-test-overview">
      {testgrunnlag.map((etTestgrunnlag) => {
        const namn =
          contextKontroll.loeysingList.find(
            (loeysing) => loeysing.id === etTestgrunnlag.loeysingId
          )?.namn ?? '';
        return (
          <TestLoeysingButton
            key={etTestgrunnlag.id}
            name={namn}
            status={'ikkje-starta'}
            onClick={() => onChangeLoeysing(etTestgrunnlag)}
          />
        );
      })}
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

export default TestOverview;
