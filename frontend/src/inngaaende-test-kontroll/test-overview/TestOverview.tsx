import AlertTimed from '@common/alert/AlertTimed';
import useAlert from '@common/alert/useAlert';
import { getFullPath, idPath } from '@common/util/routeUtils';
import TestLoeysingButton from '@test/test-overview/TestLoeysingButton';
import { TEST_LOEYSING_TESTGRUNNLAG } from '@test/TestingRoutes';
import { useCallback } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { TestContext } from '../types';

const TestOverview = () => {
  const { id } = useParams();
  const { contextLoeysingWithSideutval, testgrunnlag }: TestContext = useOutletContext();
  const navigate = useNavigate();
  const [alert, setAlert] = useAlert();

  const onChangeLoeysing = useCallback(
    async (loeysingId: number) => {
      const nextLoeysingId = contextLoeysingWithSideutval.find(
        (l) => l.id === loeysingId
      )?.id;
      if (!nextLoeysingId || !id) {
        setAlert('danger', 'Det oppstod ein feil ved ending av løysing');
      } else {
        const existingTestgrunnlag = testgrunnlag.find(
          (tg) => tg.loeysingId === nextLoeysingId
        );
        let testgrunnlagId: number;

        if (existingTestgrunnlag) {
          testgrunnlagId = existingTestgrunnlag.id;
          navigate(
            getFullPath(
              TEST_LOEYSING_TESTGRUNNLAG,
              { pathParam: idPath, id: id },
              {
                pathParam: ':loeysingId',
                id: String(nextLoeysingId),
              },
              { pathParam: ':testgrunnlagId', id: String(testgrunnlagId) }
            )
          );
        } else {
          setAlert('danger', 'Testgrunnlag er ikkje blitt oppretta');
        }
      }
    },
    [contextLoeysingWithSideutval, testgrunnlag, id, navigate, setAlert]
  );

  return (
    <div className="manual-test-overview">
      {contextLoeysingWithSideutval.map((loeysing) => {
        return (
          <TestLoeysingButton
            key={loeysing.id}
            name={loeysing.namn}
            status={'ikkje-starta'}
            onClick={() => onChangeLoeysing(loeysing.id)}
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
