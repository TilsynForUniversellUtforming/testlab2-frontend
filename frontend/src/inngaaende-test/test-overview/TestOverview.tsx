import AlertTimed from '@common/alert/AlertTimed';
import useAlert from '@common/alert/useAlert';
import TestlabStatusTag from '@common/status-badge/TestlabStatusTag';
import { isEmpty, last } from '@common/util/arrayUtils';
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

import classes from './test-overview.module.css';

export type TestOverviewLoaderData = {
  resultater: ResultatManuellKontroll[];
  testgrunnlag: Testgrunnlag[];
};

export function teststatus(
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

export function visRetestKnapp(
  testgrunnlag: Testgrunnlag,
  alleTestgrunnlag: Testgrunnlag[],
  resultater: ResultatManuellKontroll[]
) {
  const testgrunnlagForKontroll = alleTestgrunnlag
    .filter((t) => t.kontrollId === testgrunnlag.kontrollId)
    .toSorted((a, b) => {
      const aTime = Date.parse(a.datoOppretta);
      const bTime = Date.parse(b.datoOppretta);
      return aTime - bTime;
    });
  const resultaterForTestgrunnlag = resultater.filter(
    (r) => r.testgrunnlagId === testgrunnlag.id
  );
  return (
    teststatus(resultater) === 'ferdig' &&
    resultaterForTestgrunnlag.some((r) => r.elementResultat === 'brot') &&
    last(testgrunnlagForKontroll)?.id === testgrunnlag.id
  );
}

function visSlettKnapp(
  testgrunnlag: Testgrunnlag,
  status: ManuellTestStatus
): boolean {
  return testgrunnlag.type === 'RETEST' && status === 'ikkje-starta';
}

const TestOverview = () => {
  const { id } = useParams();
  const { contextKontroll }: TestContextKontroll = useOutletContext();
  const navigate = useNavigate();
  const [alert, setAlert] = useAlert();
  const { resultater, testgrunnlag } =
    useLoaderData() as TestOverviewLoaderData;
  const submit = useSubmit();

  const onChangeLoeysing = useCallback(
    async (testgrunnlag: Testgrunnlag, loeysingId: number) => {
      const loeysing = contextKontroll.loeysingList.find(
        (l) => l.id === loeysingId
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
              id: String(loeysingId),
            },
            { pathParam: ':testgrunnlagId', id: String(testgrunnlag.id) }
          )
        );
      }
    },
    [contextKontroll.loeysingList, testgrunnlag, id, navigate, setAlert]
  );

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

  function slett(etTestgrunnlag: Testgrunnlag): void {
    submit(etTestgrunnlag, { method: 'delete', encType: 'application/json' });
  }

  return (
    <div className="manual-test-overview">
      {testgrunnlag.flatMap((etTestgrunnlag) => {
        const loeysingTestgrunnlag = Object.groupBy(
          etTestgrunnlag.sideutval,
          ({ loeysingId }) => loeysingId
        );

        return Object.entries(loeysingTestgrunnlag).map(
          ([loeysingIdKey, sideutval]) => {
            const loeysingId = Number(loeysingIdKey);
            const sideutvalIds = sideutval?.map((su) => su.id) ?? [];

            const namn =
              contextKontroll.loeysingList.find(
                (loeysing) => loeysing.id === loeysingId
              )?.namn ?? '';

            const status = teststatus(
              resultater.filter((r) => r.testgrunnlagId === etTestgrunnlag.id)
            );

            return (
              <div
                key={`${etTestgrunnlag.id}/${loeysingId}`}
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
                      {viewTestType(etTestgrunnlag, sideutvalIds, testgrunnlag)}
                    </Tag>
                    <Tag color="info" size="small">
                      Nettsted
                    </Tag>
                  </div>
                  <div className={classes.buttons}>
                    <Button
                      title="Start testing"
                      onClick={() =>
                        onChangeLoeysing(etTestgrunnlag, loeysingId)
                      }
                    >
                      {status === 'ikkje-starta'
                        ? 'Start testing'
                        : 'Fortsett testing'}
                    </Button>
                    {visRetestKnapp(
                      etTestgrunnlag,
                      testgrunnlag,
                      resultater
                    ) && (
                      <Button
                        variant="secondary"
                        onClick={() => retest(etTestgrunnlag)}
                      >
                        Retest
                      </Button>
                    )}
                    {visSlettKnapp(etTestgrunnlag, status) && (
                      <Button
                        variant="secondary"
                        color="danger"
                        onClick={() => slett(etTestgrunnlag)}
                      >
                        Slett
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          }
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

export function viewTestType(
  etTestgrunnlag: Testgrunnlag,
  etSideutvalIds: number[],
  alleTestgrunnlag: Testgrunnlag[]
) {
  const normalized = sanitizeEnumLabel(etTestgrunnlag.type);
  if (etTestgrunnlag.type === 'RETEST') {
    const countTidligereRetester = alleTestgrunnlag
      .filter((t) => t.type === 'RETEST')
      .filter((t) => t.sideutval.some((s) => etSideutvalIds.includes(s.id)))
      .filter(
        (t) =>
          Date.parse(t.datoOppretta) < Date.parse(etTestgrunnlag.datoOppretta)
      ).length;
    return `${normalized} ${countTidligereRetester + 1}`;
  } else {
    return normalized;
  }
}
