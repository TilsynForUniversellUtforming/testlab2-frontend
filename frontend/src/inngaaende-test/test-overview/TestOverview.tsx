import AlertTimed from '@common/alert/AlertTimed';
import useAlert from '@common/alert/useAlert';
import { getFullPath, idPath } from '@common/util/routeUtils';
import TestLoeysingButton from '@test/test-overview/TestLoeysingButton';
import { TEST_LOEYSING } from '@test/TestingRoutes';
import { TestContext } from '@test/types';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

const TestOverview = () => {
  const { id } = useParams();
  const { contextSak }: TestContext = useOutletContext();
  const navigate = useNavigate();
  const [alert, setAlert] = useAlert();

  const onChangeLoeysing = (loeysingId: number) => {
    const nextLoeysing = contextSak.loeysingList.find(
      (l) => l.loeysing.id === loeysingId
    );
    if (!nextLoeysing || !id) {
      setAlert('danger', 'Det oppstod ein feil ved ending av løysing');
    } else {
      navigate(
        getFullPath(
          TEST_LOEYSING,
          { pathParam: idPath, id: id },
          { id: String(nextLoeysing.loeysing.id), pathParam: ':loeysingId' }
        )
      );
    }
  };

  return (
    <div className="manual-test-overview">
      {contextSak.loeysingList.map(({ loeysing }) => {
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
