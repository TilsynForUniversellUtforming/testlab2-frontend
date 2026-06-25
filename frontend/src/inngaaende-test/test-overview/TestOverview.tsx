import AlertTimed from '@common/alert/AlertTimed';
import useAlert from '@common/alert/useAlert';
import TestlabStatusTag from '@common/status-badge/TestlabStatusTag';
import { ButtonVariant } from '@common/types';
import { getFullPath, idPath } from '@common/util/routeUtils';
import {
  Alert,
  Button,
  Heading,
  Paragraph,
  Tag,
} from '@digdir/designsystemet-react';
import { DeleteTestgrunnlagRequest, RetestRequest } from '@test/api/types';
import TestStatistics from '@test/test-overview/TestStatistics';
import { TEST_LOEYSING_KONTROLL } from '@test/TestingRoutes';
import { ManuellTestStatus, TestOverviewLoaderData } from '@test/types';
import { useCallback } from 'react';
import {
  Link,
  useLoaderData,
  useNavigate,
  useParams,
  useSubmit,
} from 'react-router-dom';
import { KlageType } from '../../styringsdata/types';
import classes from './test-overview.module.css';
import TestStatusChart from './TestStatusChart';
import { getStyringsdataPath, getJobstatus } from './util/testOverviewUtils';
import { capitalize, sanitizeEnumLabel } from '@common/util/stringutils';

const TestOverview = () => {
  const { id } = useParams();
  const kontrollId = Number(id);

  const navigate = useNavigate();
  const [alert, setAlert] = useAlert();
  const { styringsdataError, testgrunnlagOverviewElements } =
    useLoaderData() as TestOverviewLoaderData;
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

  function retest(
    testgrunnlagId: number,
    loeysingId: number,
  ) {
      const retestRequest: RetestRequest = {
        originalTestgrunnlagId: testgrunnlagId,
        kontrollId: kontrollId,
        loeysingId: loeysingId,
      };

      submit(retestRequest, { method: 'post', encType: 'application/json' });
  }

  function slett(testgrunnlagId: number, kontrollId: number): void {
    const deleteRequest: DeleteTestgrunnlagRequest = {
      testgrunnlagId: testgrunnlagId,
      kontrollId: kontrollId,
    };
    submit(deleteRequest, { method: 'delete', encType: 'application/json' });
  }

  return (
    <div className={classes.testContainer}>
      <div className={classes.testWrapper}>
        {styringsdataError && (
          <Alert data-color="danger">Kunne ikkje hente styringsdata</Alert>
        )}
        {testgrunnlagOverviewElements.length === 0 && (
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
        {testgrunnlagOverviewElements.map((element) => {
          const {
            loeysingId,
            loeysingNamn,
            testgrunnlagType,
            styringsdataId,
            styringsdataStatus,
            status,
            teststatistics,
            kanReteste,
            kanSlette,
            kontrollType,
            loeysingstype
          } = element;
          const testgrunnlagId = teststatistics.testgrunnlagId
          const styringsdataPath = getStyringsdataPath(
            kontrollId,
            loeysingId,
            styringsdataId || undefined
          );

          console.log(status.toLowerCase());

          return (
            <div
              key={`${testgrunnlagId}/${loeysingId}`}
              className={classes.loeysingButton}
            >
              <div className={classes.loeysingButtonTag}>
                <TestlabStatusTag<ManuellTestStatus>
                  status={status.toLowerCase()}
                  colorMapping={{
                    warning: ['under-arbeid'],
                    info: ['ikkje-starta'],
                    success: ['ferdig'],
                  }}
                  data-size="sm"
                />
                <TestStatusChart
                  total={teststatistics.total}
                  finished={teststatistics.ferdig}
                  testing={teststatistics.underArbeid}
                  pending={teststatistics.ikkjeStarta}
                />
                <TestStatistics
                  percentSideutval={teststatistics.percentagePerSide}
                  percentInnhaldstype={teststatistics.percentagePerInnholdstype}
                />
              </div>
              <div className={classes.loeysingButtonInnhold}>
                <div className={classes.loeysingTestMetadata}>
                  <div className={classes.headingWrapper}>
                    <Heading data-size="md" level={4}>
                      {loeysingNamn}
                    </Heading>
                    {styringsdataStatus && styringsdataStatus!=='INGEN_REAKSJON_BRUKT' && (
                      <TestlabStatusTag<KlageType>
                        status={styringsdataStatus.toLowerCase()}
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
                      <Tag data-color="warning" data-size="sm">
                        {capitalize(kontrollType)}
                      </Tag>
                      {testgrunnlagType=='RETEST' &&
                      <Tag data-color="warning" data-size="sm">
                        {sanitizeEnumLabel(testgrunnlagType)}
                      </Tag>
                      }
                    </div>
                    <Tag data-color="neutral" data-size="sm">
                      {sanitizeEnumLabel(loeysingstype)}
                    </Tag>
                  </div>
                </div>
                <div className={classes.buttons}>
                  <Button
                    title="Start testing"
                    onClick={() => onChangeLoeysing(testgrunnlagId, loeysingId)}
                  >
                    {getJobstatus(status)}
                  </Button>
                  {kanReteste && (
                    <Button
                      variant="secondary"
                      onClick={() => retest(testgrunnlagId, loeysingId)}
                    >
                      Retest
                    </Button>
                  )}
                  {kanSlette && (
                    <Button
                      variant="secondary"
                      color="danger"
                      onClick={() => slett(testgrunnlagId, kontrollId)}
                    >
                      Slett
                    </Button>
                  )}
                  <Link to={styringsdataPath}>
                    <Button
                      variant={ButtonVariant.Outline}
                      disabled={styringsdataError}
                    >
                      {styringsdataId
                        ? 'Endre styringsdata'
                        : 'Legg til styringsdata'}
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
