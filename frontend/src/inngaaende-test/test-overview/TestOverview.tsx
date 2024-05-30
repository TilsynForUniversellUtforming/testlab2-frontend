import AlertTimed from '@common/alert/AlertTimed';
import useAlert from '@common/alert/useAlert';
import TestlabStatusTag from '@common/status-badge/TestlabStatusTag';
import { isEmpty } from '@common/util/arrayUtils';
import { getFullPath, idPath } from '@common/util/routeUtils';
import { sanitizeEnumLabel } from '@common/util/stringutils';
import { Button, Heading, Tag } from '@digdir/designsystemet-react';
import { ResultatManuellKontroll } from '@test/api/types';
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
  useSubmit,
} from 'react-router-dom';

import { Sideutval } from '../../kontroll/sideutval/types';
import classes from './test-overview.module.css';

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
  const submit = useSubmit();

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
    if (resultater.length === 0) {
      return 'ikkje-starta';
    } else if (resultater.every((r) => r.status === 'Ferdig')) {
      return 'ferdig';
    } else {
      return 'under-arbeid';
    }
  }

  function retest(testgrunnlag: Testgrunnlag) {
    const res = resultater
      .filter((r) => r.testgrunnlagId === testgrunnlag.id)
      .filter((r) => r.elementResultat === 'brot');
    if (isEmpty(res)) {
      console.debug('ingen brot');
    } else {
      const nyttTestgrunnlag = {
        kontrollId: contextKontroll.id,
        namn: `Retest for kontroll ${contextKontroll.id}`,
        type: 'RETEST',
        sideutval: testgrunnlag.sideutval.filter((s) =>
          res.map((r) => r.loeysingId).includes(s.loeysingId)
        ),
        testregelIdList: res.map((r) => r.testregelId),
      };
      submit(nyttTestgrunnlag, { method: 'post', encType: 'application/json' });
    }
  }

  function viewTestType(testgrunnlag: Testgrunnlag) {
    const normalized = sanitizeEnumLabel(testgrunnlag.type);
    if (testgrunnlag.type === 'RETEST') {
      const datoOppretta = Date.parse(testgrunnlag.datoOppretta);
      const formatter = new Intl.DateTimeFormat('nn', {
        month: 'long',
        year: 'numeric',
      });
      const dateString = formatter.format(datoOppretta);
      return `${normalized} ${dateString}`;
    } else {
      return normalized;
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
            <div
              key={etSideutval.loeysingId}
              className="manual-test__loeysing-button"
            >
              <div className="tag-wrapper">
                <TestlabStatusTag<ManuellTestStatus>
                  status={status}
                  colorMapping={{
                    second: ['under-arbeid'],
                    info: ['ikkje-starta'],
                    first: ['ferdig'],
                  }}
                  size="small"
                />
              </div>
              <div className="content-wrapper">
                <div className="content">
                  <Heading size="medium" level={4} spacing>
                    {namn}
                  </Heading>
                  <Tag color="second" size="small">
                    Inngående kontroll
                  </Tag>
                  <Tag color="second" size="small">
                    {viewTestType(etTestgrunnlag)}
                  </Tag>
                  <Tag color="info" size="small">
                    Nettsted
                  </Tag>
                </div>
                <div className={classes.buttons}>
                  <Button
                    title="Start testing"
                    onClick={() =>
                      onChangeLoeysing(etTestgrunnlag, etSideutval)
                    }
                  >
                    {status === 'ikkje-starta'
                      ? 'Start testing'
                      : 'Fortsett testing'}
                  </Button>
                  {status === 'ferdig' && (
                    <Button
                      variant="secondary"
                      onClick={() => retest(etTestgrunnlag)}
                    >
                      Retest
                    </Button>
                  )}
                </div>
              </div>
            </div>
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
