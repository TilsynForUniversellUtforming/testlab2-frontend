import AlertTimed from '@common/alert/AlertTimed';
import useAlert from '@common/alert/useAlert';
import { getFullPath, idPath } from '@common/util/routeUtils';
import TestLoeysingButton from '@test/test-overview/TestLoeysingButton';
import { TEST_LOEYSING_KONTROLL } from '@test/TestingRoutesKontroll';
import { TestContextKontroll } from '@test/types';
import { useCallback } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

const TestOverviewKontroll = () => {
  const { id } = useParams();
  const { contextKontroll, testgrunnlag }: TestContextKontroll =
    useOutletContext();
  const navigate = useNavigate();
  const [alert, setAlert] = useAlert();

  const onChangeLoeysing = useCallback(
    async (loeysingId: number) => {
      const nextLoeysingId = contextKontroll.loeysingList.find(
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
              TEST_LOEYSING_KONTROLL,
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
    [contextKontroll.loeysingList, testgrunnlag, id, navigate, setAlert]
  );

  return (
    <div className="manual-test-overview">
      {contextKontroll.loeysingList.map((loeysing) => {
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

export default TestOverviewKontroll;
