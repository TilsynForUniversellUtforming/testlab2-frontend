import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

import AlertTimed from '../../common/alert/AlertTimed';
import AppRoutes, {
  appRoutes,
  getFullPath,
  idPath,
} from '../../common/appRoutes';
import toError from '../../common/error/util';
import { useEffectOnce } from '../../common/hooks/useEffectOnce';
import UserActionTable from '../../common/table/UserActionTable';
import { extractDomain } from '../../common/util/stringutils';
import { isNotDefined } from '../../common/util/util';
import { restart } from '../../maaling/api/maaling-api';
import { Maaling, RestartRequest, TestResult } from '../../maaling/api/types';
import { MaalingContext, MaalingTestStatus } from '../../maaling/types';
import fetchTestResultatLoeysing from '../api/tester-api';
import { TestResultat } from '../api/types';
import { getTestresultatColumns } from './TestResultatColumns';

const getSelectedLoeysing = (
  loeysingId?: string,
  maaling?: Maaling
): TestResult | undefined =>
  maaling?.testResult.find((tr) => tr.loeysing.id === Number(loeysingId));

const TestResultListApp = () => {
  const navigate = useNavigate();
  const { id, loeysingId } = useParams();

  const { contextError, contextLoading, maaling, setMaaling }: MaalingContext =
    useOutletContext();

  const [testResult, setTestresult] = useState<TestResultat[]>([]);
  const [error, setError] = useState(contextError);
  const [loading, setLoading] = useState(contextLoading);
  const [selectedLoeysing, setSelectedLoeysing] = useState(
    getSelectedLoeysing(loeysingId, maaling)
  );
  const [testStatus, setTestStatus] = useState<MaalingTestStatus>({
    loading: false,
    message: undefined,
  });

  const testResultatColumns = useMemo(() => getTestresultatColumns(), []);

  useEffect(() => {
    setLoading(contextLoading);
    if (!contextLoading) {
      setSelectedLoeysing(getSelectedLoeysing(loeysingId, maaling));
    }
  }, [contextLoading]);

  const fetchTestresultat = useCallback(() => {
    setLoading(true);
    setError(undefined);

    const doFetchTestresultat = async () => {
      try {
        if (id && loeysingId) {
          const resultat = await fetchTestResultatLoeysing(
            Number(id),
            Number(loeysingId)
          );
          setTestresult(resultat);
        } else {
          setError(new Error('Testresultat finnes ikkje'));
        }
      } catch (e) {
        setError(toError(e, 'Kunne ikkje finne testresultat'));
      }
    };

    doFetchTestresultat().finally(() => {
      setLoading(false);
    });
  }, []);

  useEffectOnce(() => {
    fetchTestresultat();
  });

  const onClickRestart = useCallback(() => {
    setLoading(true);

    if (typeof maaling === 'undefined') {
      setError(new Error('Måling finnes ikkje'));
      return;
    } else if (
      isNotDefined(selectedLoeysing?.loeysing) ||
      !selectedLoeysing?.loeysing
    ) {
      setError(new Error('Løysing finnes ikkje på måling'));
      return;
    }

    const doRestart = async () => {
      try {
        const restartCrawlingRequest: RestartRequest = {
          maalingId: maaling.id,
          loeysingIdList: { idList: [selectedLoeysing.loeysing.id] },
          process: 'test',
        };

        const restartedMaaling = await restart(restartCrawlingRequest);
        setMaaling(restartedMaaling);
        navigate(
          getFullPath(appRoutes.MAALING, {
            id: String(maaling.id),
            pathParam: idPath,
          })
        );
      } catch (e) {
        setError(toError(e, 'Noko gikk gale ved restart av sideutval'));
      }
    };

    doRestart().finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <>
      <UserActionTable<TestResultat>
        heading={`Resultat ${extractDomain(selectedLoeysing?.loeysing?.url)}`}
        subHeading={`Måling: ${maaling?.navn ?? ''}`}
        linkPath={
          maaling
            ? getFullPath(AppRoutes.MAALING, {
                id: String(maaling.id),
                pathParam: idPath,
              })
            : undefined
        }
        tableProps={{
          data: testResult,
          defaultColumns: testResultatColumns,
          loading: loading,
          onClickRetry: fetchTestresultat,
          displayError: {
            error: error,
          },
        }}
        menuButtons={{
          title: 'Meny for testresultat',
          disabled: loading,
          actions: [
            {
              action: 'restart',
              modalProps: {
                title: 'Køyr test på nytt',
                message: `Vil du køyre test på nytt for ${extractDomain(
                  selectedLoeysing?.loeysing?.url
                )}?`,
                onConfirm: onClickRestart,
              },
            },
            {
              action: 'delete',
              modalProps: {
                title: 'Ta løysing ut av måling',
                message: `Vil du køyre test på nytt for ${extractDomain(
                  selectedLoeysing?.loeysing?.url
                )}?`,
                onConfirm: () =>
                  setTestStatus({
                    loading: false,
                    message: 'Kan ikkje slette løysingar frå måling ennå',
                    severity: 'warning',
                  }),
              },
            },
          ],
        }}
      />
      {testStatus.message && (
        <div className="status__alert">
          <AlertTimed
            severity={testStatus?.severity}
            message={testStatus.message}
            clearMessage={() =>
              setTestStatus({ loading: false, message: undefined })
            }
          />
        </div>
      )}
    </>
  );
};

export default TestResultListApp;
