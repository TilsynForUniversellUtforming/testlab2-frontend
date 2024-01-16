import AlertTimed from '@common/alert/AlertTimed';
import useContentDocumentTitle from '@common/hooks/useContentDocumentTitle';
import { LegacyTableRowAction } from '@common/table/types';
import UserActionTable from '@common/table/UserActionTable';
import { getFullPath, idPath } from '@common/util/routeUtils';
import { extractDomain } from '@common/util/stringutils';
import { AggregatedTestresult } from '@maaling/api/types';
import { MAALING, TEST_RESULT_LIST } from '@maaling/MaalingRoutes';
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

  useContentDocumentTitle(
    TEST_RESULT_LIST.navn,
    loeysingTestResult?.loeysing?.namn
  );

  const rowActions = useMemo<LegacyTableRowAction[]>(() => {
    const rowActionList: LegacyTableRowAction[] = [];
    if (maaling?.status === 'testing_ferdig') {
      rowActionList.push(
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
        }
      );
    }

    return rowActionList;
  }, [maaling]);

  return (
    <>
      <UserActionTable<AggregatedTestresult>
        heading={`Resultat ${extractDomain(loeysingTestResult?.loeysing?.url)}`}
        subHeading={`Måling: ${maaling?.navn ?? ''}`}
        linkPath={
          maaling
            ? getFullPath(MAALING, {
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
          onClickRow: (row) =>
            navigate(String(row?.original.testregelId ?? '')),
          rowActions: rowActions,
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
