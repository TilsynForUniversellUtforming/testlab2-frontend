import AlertTimed from '@common/alert/AlertTimed';
import useAlert from '@common/alert/useAlert';
import TestlabStatusTag from '@common/status-badge/TestlabStatusTag';
import { ButtonVariant } from '@common/types';
import { isEmpty } from '@common/util/arrayUtils';
import { getFullPath, idPath } from '@common/util/routeUtils';
import { Alert, Button, Heading, Paragraph, Tag } from '@digdir/designsystemet-react';
import { RetestRequest } from '@test/api/types';
import TestStatistics from '@test/test-overview/TestStatistics';
import { TEST_LOEYSING_KONTROLL } from '@test/TestingRoutes';
import { ManuellTestStatus, Testgrunnlag, TestOverviewLoaderData } from '@test/types';
import { useCallback } from 'react';
import { Link, useLoaderData, useNavigate, useParams, useSubmit } from 'react-router-dom';
import { KlageType } from '../../styringsdata/types';
import classes from './test-overview.module.css';
import TestStatusChart from './TestStatusChart';
import {
  getStyringsdataPath,
  hasLoeysingBrot,
  getJobstatus,
  visRetestKnapp,
  visSlettKnapp,
} from './util/testOverviewUtils';

const TestOverview = () => {
  const { id } = useParams();
  const kontrollId = Number(id);

  const navigate = useNavigate();
  const [alert, setAlert] = useAlert();
  const {
    resultater,
    testgrunnlag,
    styringsdataError,
    testoverviewElements,
  } = useLoaderData() as TestOverviewLoaderData;
  const submit = useSubmit();

  const onChangeLoeysing = useCallback(
    async (testgrunnlagId: number, loeysingId: number) => {
      if (!loeysingId || !id) {
        setAlert('danger', 'Det oppstod ein feil ved endring av løysing');
      } else {
        navigate(
          getFullPath(
            TEST_LOEYSING_KONTROLL,
            { pathParam: idPath, id: id },
            {
              pathParam: ':loeysingId',
              id: String(loeysingId),
            },
            { pathParam: ':testgrunnlagId', id: String(testgrunnlagId) }
          )
        );
      }
    },
    [id, navigate, setAlert]
  );

  function retest(testgrunnlagId: number, loeysingId: number) {
    const rs = hasLoeysingBrot(resultater, testgrunnlagId, loeysingId);
    if (isEmpty(rs)) {
      console.debug('ingen brot');
    } else {
      const retestRequest: RetestRequest = {
        originalTestgrunnlagId: testgrunnlagId,
        kontrollId: kontrollId,
        loeysingId: loeysingId,
      };

      submit(retestRequest, { method: 'post', encType: 'application/json' });
    }
  }

  function slett(etTestgrunnlag: Testgrunnlag): void {
    submit(etTestgrunnlag, { method: 'delete', encType: 'application/json' });
  }

  return (
    <div className={classes.testContainer}>
      <div className={classes.testWrapper}>
        {styringsdataError && (
          <Alert data-color="danger">Kunne ikkje hente styringsdata</Alert>
        )}
        {testgrunnlag.length === 0 && (
          <Alert data-color="warning">
            <Heading level={3} data-size="xs">
              Ingen testgrunnlag for test
            </Heading>
            <Paragraph>
              Sjå over kontrollen og sjekk at alle parametrar er fylt ut{' '}
              <Link to={`../../kontroll/${String(id)}`}>her</Link>
            </Paragraph>
          </Alert>
        )}
        {testoverviewElements.map((element) => {
          const { testgrunnlagId, loeysingId, loeysingNamn, testStatus, testType, styringsdataId, styringsdataStatus } = element;
          const etTestgrunnlag = testgrunnlag.find((tg) => tg.id === testgrunnlagId)!;
          const styringsdataPath = getStyringsdataPath(kontrollId, loeysingId, styringsdataId || undefined);

          return (
            <div
              key={`${testgrunnlagId}/${loeysingId}`}
              className={classes.loeysingButton}
            >
              <div className={classes.loeysingButtonTag}>
                <TestlabStatusTag<ManuellTestStatus>
                  status={testStatus}
                  colorMapping={{
                    second: ['under-arbeid'],
                    info: ['ikkje-starta'],
                    success: ['ferdig'],
                  }}
                  data-size="sm"
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
                    <Heading data-size="md" level={4}>
                      {loeysingNamn}
                    </Heading>
                    {styringsdataStatus && (
                      <TestlabStatusTag<KlageType>
                        status={styringsdataStatus}
                        colorMapping={{
                          danger: ['bot'],
                          warning: ['paalegg'],
                        }}
                        data-size="sm"
                      />
                    )}
                  </div>
                  <div className={classes.tagWrapper}>
                    <div className={classes.testTags}>
                      <Tag color="second" data-size="sm">
                        Inngående kontroll
                      </Tag>
                      <Tag color="second" data-size="sm">
                        {testType}
                      </Tag>
                    </div>
                    <Tag color="info" data-size="sm">
                      Nettsted
                    </Tag>
                  </div>
                </div>
                <div className={classes.buttons}>
                  <Button
                    title="Start testing"
                    onClick={() => onChangeLoeysing(testgrunnlagId, loeysingId)}
                  >
                    {getJobstatus(testStatus)}
                  </Button>
                  {visRetestKnapp(etTestgrunnlag, loeysingId, testgrunnlag, resultater) && (
                    <Button
                      variant="secondary"
                      onClick={() => retest(testgrunnlagId, loeysingId)}
                    >
                      Retest
                    </Button>
                  )}
                  {visSlettKnapp(etTestgrunnlag, testStatus) && (
                    <Button
                      variant="secondary"
                      color="danger"
                      onClick={() => slett(etTestgrunnlag)}
                    >
                      Slett
                    </Button>
                  )}
                  <Link to={styringsdataPath}>
                    <Button
                      variant={ButtonVariant.Outline}
                      disabled={styringsdataError}
                    >
                      {styringsdataId ? 'Endre styringsdata' : 'Legg til styringsdata'}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
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

