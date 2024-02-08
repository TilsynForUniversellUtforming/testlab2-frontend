import AlertTimed from '@common/alert/AlertTimed';
import useAlert from '@common/alert/useAlert';
import { getFullPath, idPath } from '@common/util/routeUtils';
import { LoeysingNettsideRelation } from '@sak/types';
import { createTestgrunnlag } from '@test/api/testing-api';
import { CreateTestgrunnlag } from '@test/api/types';
import TestLoeysingButton from '@test/test-overview/TestLoeysingButton';
import { TEST_LOEYSING_TESTGRUNNLAG } from '@test/TestingRoutes';
import { TestContext } from '@test/types';
import { useCallback } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

const TestOverview = () => {
  const { id } = useParams();
  const { contextSak }: TestContext = useOutletContext();
  const navigate = useNavigate();
  const [alert, setAlert] = useAlert();

  const onChangeLoeysing = useCallback(
    async (loeysingId: number) => {
      const nextLoeysing = contextSak.loeysingList.find(
        (l) => l.loeysing.id === loeysingId
      );
      if (!nextLoeysing || !id) {
        setAlert('danger', 'Det oppstod ein feil ved ending av løysing');
      } else {
        const nyttTestgrunnlag = await opprettTestgrunnlag(nextLoeysing);
        navigate(
          getFullPath(
            TEST_LOEYSING_TESTGRUNNLAG,
            { pathParam: idPath, id: id },
            { pathParam: ':loeysingId', id: String(nextLoeysing.loeysing.id) },
            { pathParam: ':testgrunnlagId', id: String(nyttTestgrunnlag) }
          )
        );
      }
    },
    [contextSak.loeysingList, id, navigate, setAlert]
  );

  const opprettTestgrunnlag = useCallback(
    async (loeysing: LoeysingNettsideRelation): Promise<number> => {
      const testgrunnlag: CreateTestgrunnlag = {
        namn: `Test av ${loeysing.loeysing.namn} for sak ${contextSak.id}`,
        parentId: contextSak.id,
        loeysingNettsideRelation: loeysing,
        testreglar: contextSak.testreglar.map((testregel) => testregel.id),
        type: 'OPPRINNELEG_TEST',
      };
      const nyttTestgrunnlag = await createTestgrunnlag(testgrunnlag);
      return nyttTestgrunnlag.id;
    },
    [contextSak.id, contextSak.testreglar]
  );

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
