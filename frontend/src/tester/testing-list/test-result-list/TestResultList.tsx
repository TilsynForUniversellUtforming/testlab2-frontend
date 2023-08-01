import AlertTimed from '@common/alert/AlertTimed';
import AppRoutes, { getFullPath, idPath } from '@common/appRoutes';
import UserActionTable from '@common/table/UserActionTable';
import { extractDomain } from '@common/util/stringutils';
import { AggregatedTestresult } from '@maaling/api/types';
import { MaalingTestStatus } from '@maaling/types';
import { useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { TestResultContext } from '../../types';
import { getAggregatedResultColumns } from './TestResultColumns';

const TestResultList = () => {
  const {
    maaling,
    refreshMaaling,
    onClickRestart,
    loeysingTestResult,
    contextLoading,
    contextError,
  }: TestResultContext = useOutletContext();

  const navigate = useNavigate();

  const testResultatColumns = useMemo(() => getAggregatedResultColumns(), []);
  const [testStatus, setTestStatus] = useState<MaalingTestStatus>({
    loading: false,
    message: undefined,
  });

  return (
    <>
      <UserActionTable<AggregatedTestresult>
        heading={`Resultat ${extractDomain(loeysingTestResult?.loeysing?.url)}`}
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
          data: loeysingTestResult?.aggregatedResultList ?? [],
          defaultColumns: testResultatColumns,
          loading: contextLoading,
          onClickRetry: refreshMaaling,
          displayError: {
            error: contextError,
          },
          onClickCallback: (row) =>
            navigate(String(row?.original.testregelId ?? '')),
        }}
        menuButtons={{
          title: 'Meny for testresultat',
          disabled: contextLoading,
          actions: [
            {
              action: 'restart',
              modalProps: {
                title: 'Køyr test på nytt',
                message: `Vil du køyre test på nytt for ${extractDomain(
                  loeysingTestResult?.loeysing?.url
                )}?`,
                onConfirm: onClickRestart,
              },
            },
            {
              action: 'delete',
              modalProps: {
                title: 'Ta løysing ut av måling',
                message: `Vil du ta ut test fra ${extractDomain(
                  loeysingTestResult?.loeysing?.url
                )}?`,
                onConfirm: () =>
                  setTestStatus({
                    loading: false,
                    message: 'Kan ikkje ta løysingar frå måling ennå',
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

export default TestResultList;
