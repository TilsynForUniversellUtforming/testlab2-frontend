import AlertTimed from '@common/alert/AlertTimed';
import useAlert from '@common/alert/useAlert';
import { getFullPath, idPath } from '@common/util/routeUtils';
import { ResultatManuellKontroll } from '@test/api/types';
import TestLoeysingButton from '@test/test-overview/TestLoeysingButton';
import { TEST_LOEYSING_KONTROLL } from '@test/TestingRoutes';
import {
  ManuellTestStatus,
  TestContextKontroll,
  Testgrunnlag,
} from '@test/types';
import { useCallback } from 'react';
import {
  useLoaderData,
  useNavigate,
  useOutletContext,
  useParams,
} from 'react-router-dom';

import { Sideutval } from '../../kontroll/sideutval/types';

export type TestOverviewLoaderData = {
  resultater: ResultatManuellKontroll[];
  testgrunnlag: Testgrunnlag[];
};

const TestOverview = () => {
  const { id } = useParams();
  const { contextKontroll }: TestContextKontroll = useOutletContext();
  const navigate = useNavigate();
  const [alert, setAlert] = useAlert();
  const { resultater, testgrunnlag } =
    useLoaderData() as TestOverviewLoaderData;

  const onChangeLoeysing = useCallback(
    async (testgrunnlag: Testgrunnlag, sideutval: Sideutval) => {
      const loeysing = contextKontroll.loeysingList.find(
        (l) => l.id === sideutval.loeysingId
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
              id: String(sideutval.loeysingId),
            },
            { pathParam: ':testgrunnlagId', id: String(testgrunnlag.id) }
          )
        );
      }
    },
    [contextKontroll.loeysingList, testgrunnlag, id, navigate, setAlert]
  );

  function teststatus(
    resultater: ResultatManuellKontroll[]
  ): ManuellTestStatus {
    console.log(resultater);
    if (resultater.length === 0) {
      return 'ikkje-starta';
    } else if (resultater.every((r) => r.status === 'Ferdig')) {
      return 'ferdig';
    } else {
      return 'under-arbeid';
    }
  }

  return (
    <div className="manual-test-overview">
      {testgrunnlag.flatMap((etTestgrunnlag) => {
        return etTestgrunnlag.sideutval.map((etSideutval) => {
          const namn =
            contextKontroll.loeysingList.find(
              (loeysing) => loeysing.id === etSideutval.loeysingId
            )?.namn ?? '';
          const status = teststatus(
            resultater.filter((r) => r.testgrunnlagId === etTestgrunnlag.id)
          );
          return (
            <TestLoeysingButton
              key={etTestgrunnlag.id}
              name={namn}
              status={status}
              onClick={() => onChangeLoeysing(etTestgrunnlag, etSideutval)}
            />
          );
        });
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
