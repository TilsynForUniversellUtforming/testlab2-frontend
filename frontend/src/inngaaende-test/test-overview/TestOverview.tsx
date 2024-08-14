import AlertTimed from '@common/alert/AlertTimed';
import useAlert from '@common/alert/useAlert';
import TestlabStatusTag from '@common/status-badge/TestlabStatusTag';
import { ButtonVariant } from '@common/types';
import { isEmpty, last } from '@common/util/arrayUtils';
import { getFullPath, idPath } from '@common/util/routeUtils';
import { sanitizeEnumLabel } from '@common/util/stringutils';
import {
  Alert,
  Button,
  Heading,
  Paragraph,
  Tag,
} from '@digdir/designsystemet-react';
import { Loeysing } from '@loeysingar/api/types';
import { ResultatManuellKontroll } from '@test/api/types';
import { KlageType, StyringsdataListElement } from '@test/styringsdata/types';
import TestStatistics from '@test/test-overview/TestStatistics';
import { TEST_LOEYSING_KONTROLL } from '@test/TestingRoutes';
import { ManuellTestStatus, Testgrunnlag } from '@test/types';
import { useCallback } from 'react';
import {
  Link,
  useLoaderData,
  useNavigate,
  useParams,
  useSubmit,
} from 'react-router-dom';

import classes from './test-overview.module.css';
import TestStatusChart from './TestStatusChart';

export type TestOverviewLoaderData = {
  loeysingList: Loeysing[];
  resultater: ResultatManuellKontroll[];
  testgrunnlag: Testgrunnlag[];
  styringsdata: StyringsdataListElement[];
};

export function teststatus(
  resultatliste: ResultatManuellKontroll[],
  testgrunnlag: Testgrunnlag,
  loeysingId: number
): ManuellTestStatus {
  const resultater = resultatliste.filter((r) => r.loeysingId === loeysingId);
  const kombinasjoner = testgrunnlag.testreglar.flatMap((tr) =>
    testgrunnlag.sideutval
      .filter((s) => s.loeysingId === loeysingId)
      .map((s) => [tr.id, s.id])
  );

  if (resultater.every((r) => r.status === 'IkkjePaabegynt')) {
    return 'ikkje-starta';
  } else {
    if (
      kombinasjoner.every(([testregelId, sideutvalId]) =>
        resultater.some(
          (r) =>
            r.testregelId === testregelId &&
            r.sideutvalId === sideutvalId &&
            r.status === 'Ferdig'
        )
      )
    ) {
      return 'ferdig';
    } else {
      return 'under-arbeid';
    }
  }
}

export function visRetestKnapp(
  testgrunnlag: Testgrunnlag,
  loeysingId: number,
  alleTestgrunnlag: Testgrunnlag[],
  resultater: ResultatManuellKontroll[]
) {
  const testgrunnlagForLoeysing = alleTestgrunnlag
    .filter((t) => t.sideutval.some((s) => s.loeysingId === loeysingId))
    .toSorted((a, b) => {
      const aTime = Date.parse(a.datoOppretta);
      const bTime = Date.parse(b.datoOppretta);
      return aTime - bTime;
    });
  const resultaterForLoeysing = resultater.filter(
    (r) => r.loeysingId === loeysingId && r.testgrunnlagId === testgrunnlag.id
  );
  return (
    teststatus(resultaterForLoeysing, testgrunnlag, loeysingId) === 'ferdig' &&
    resultaterForLoeysing.some((r) => r.elementResultat === 'brot') &&
    last(testgrunnlagForLoeysing)?.id === testgrunnlag.id
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
  const kontrollId = Number(id);

  const navigate = useNavigate();
  const [alert, setAlert] = useAlert();
  const { loeysingList, resultater, testgrunnlag, styringsdata } =
    useLoaderData() as TestOverviewLoaderData;
  const submit = useSubmit();

  const onChangeLoeysing = useCallback(
    async (testgrunnlag: Testgrunnlag, loeysingId: number) => {
      const loeysing = loeysingList.find((l) => l.id === loeysingId);
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
    [loeysingList, testgrunnlag, id, navigate, setAlert]
  );

  function retest(testgrunnlag: Testgrunnlag, loeysingId: number) {
    const rs = resultater
      .filter((r) => r.testgrunnlagId === testgrunnlag.id)
      .filter((r) => r.loeysingId === loeysingId)
      .filter((r) => r.elementResultat === 'brot');
    if (isEmpty(rs)) {
      console.debug('ingen brot');
    } else {
      const nyttTestgrunnlag = {
        kontrollId: kontrollId,
        namn: `Retest for kontroll ${kontrollId}`,
        type: 'RETEST',
        sideutval: testgrunnlag.sideutval.filter((s) =>
          rs.map((r) => r.loeysingId).includes(s.loeysingId)
        ),
        testregelIdList: rs.map((r) => r.testregelId),
      };
      submit(
        { nyttTestgrunnlag, resultater: rs },
        { method: 'post', encType: 'application/json' }
      );
    }
  }

  function slett(etTestgrunnlag: Testgrunnlag): void {
    submit(etTestgrunnlag, { method: 'delete', encType: 'application/json' });
  }

  return (
    <div className={classes.testContainer}>
      <div className={classes.testWrapper}>
        {testgrunnlag.length === 0 && (
          <Alert severity="warning">
            <Heading level={3} size="xs" spacing>
              Ingen testgrunnlag for test
            </Heading>
            <Paragraph>
              Sjå over kontrollen og sjekk at alle parametrar er fylt ut{' '}
              <Link to={`../../kontroll/${String(id)}`}>her</Link>
            </Paragraph>
          </Alert>
        )}
        {testgrunnlag.flatMap((etTestgrunnlag) => {
          const loeysingTestgrunnlag = Object.groupBy(
            etTestgrunnlag.sideutval,
            ({ loeysingId }) => loeysingId
          );

          return Object.entries(loeysingTestgrunnlag).map(
            ([loeysingIdKey, sideutval]) => {
              const loeysingId = Number(loeysingIdKey);
              const sideutvalIds = sideutval?.map((su) => su.id) ?? [];
              const loesysingStyringsdata = styringsdata.find(
                (s) => s.loeysingId === loeysingId
              );

              const namn =
                loeysingList.find((loeysing) => loeysing.id === loeysingId)
                  ?.namn ?? '';

              const status = teststatus(
                resultater.filter(
                  (r) => r.testgrunnlagId === etTestgrunnlag.id
                ),
                etTestgrunnlag,
                loeysingId
              );

              const styringsdataSearchParams = loesysingStyringsdata
                ? `?styringsdataId=${loesysingStyringsdata.id}`
                : '';

              let styringsdataStatus: string | undefined = undefined;
              if (loesysingStyringsdata?.isBot) {
                styringsdataStatus = 'bot';
              } else if (loesysingStyringsdata?.isPaalegg) {
                styringsdataStatus = 'paalegg';
              }

              return (
                <div
                  key={`${etTestgrunnlag.id}/${loeysingId}`}
                  className={classes.loeysingButton}
                >
                  <div className={classes.loeysingButtonTag}>
                    <TestlabStatusTag<ManuellTestStatus>
                      status={status}
                      colorMapping={{
                        second: ['under-arbeid'],
                        info: ['ikkje-starta'],
                        success: ['ferdig'],
                      }}
                      size="small"
                    />
                    <TestStatusChart
                      testgrunnlag={etTestgrunnlag}
                      resultater={resultater}
                      loeysingId={loeysingId}
                    />
                    <TestStatistics
                      resultatliste={resultater}
                      loeysingId={loeysingId}
                      testgrunnlag={etTestgrunnlag}
                    />
                  </div>
                  <div className={classes.loeysingButtonInnhold}>
                    <div className={classes.loeysingTestMetadata}>
                      <div className={classes.headingWrapper}>
                        <Heading size="medium" level={4}>
                          {namn}
                        </Heading>
                        {styringsdataStatus && (
                          <TestlabStatusTag<KlageType>
                            status={styringsdataStatus}
                            colorMapping={{
                              danger: ['bot'],
                              warning: ['paalegg'],
                            }}
                            size="small"
                          />
                        )}
                      </div>
                      <div className={classes.tagWrapper}>
                        <div className={classes.testTags}>
                          <Tag color="second" size="small">
                            Inngående kontroll
                          </Tag>
                          <Tag color="second" size="small">
                            {viewTestType(
                              etTestgrunnlag,
                              sideutvalIds,
                              testgrunnlag
                            )}
                          </Tag>
                        </div>
                        <Tag color="info" size="small">
                          Nettsted
                        </Tag>
                      </div>
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
                          : status === 'under-arbeid'
                            ? 'Fortsett testing'
                            : 'Vis testen'}
                      </Button>
                      {visRetestKnapp(
                        etTestgrunnlag,
                        loeysingId,
                        testgrunnlag,
                        resultater
                      ) && (
                        <Button
                          variant="secondary"
                          onClick={() => retest(etTestgrunnlag, loeysingId)}
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
                      <Link
                        to={`${loeysingId}/styringsdata${styringsdataSearchParams}`}
                      >
                        <Button variant={ButtonVariant.Outline}>
                          {loesysingStyringsdata
                            ? 'Endre styringsdata'
                            : 'Legg til styringsdata'}
                        </Button>
                      </Link>
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
