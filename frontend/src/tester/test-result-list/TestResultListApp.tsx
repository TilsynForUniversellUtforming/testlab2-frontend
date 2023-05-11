import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';

import AppTitle from '../../common/app-title/AppTitle';
import ErrorCard from '../../common/error/ErrorCard';
import toError from '../../common/error/util';
import { useEffectOnce } from '../../common/hooks/useEffectOnce';
import StatusBadge from '../../common/status-badge/StatusBadge';
import TestlabTable from '../../common/table/TestlabTable';
import fetchTestResultatLoeysing from '../api/tester-api';
import { TestResultat } from '../api/types';
import { TesterContext } from '../types';

const decodeBase64 = (base64String?: string) => {
  if (typeof base64String === 'undefined') {
    return '';
  }

  try {
    return atob(base64String);
  } catch (e) {
    console.log('Feilet decoding av ', base64String);
  }
};

const TestResultListApp = () => {
  const { loeysingId } = useParams();

  const { contextError, contextLoading, maaling }: TesterContext =
    useOutletContext();

  const [testResult, setTestresult] = useState<TestResultat[]>([]);

  const [error, setError] = useState(contextError);
  const [loading, setLoading] = useState(contextLoading);

  const testResultatColumns = React.useMemo<ColumnDef<TestResultat>[]>(
    () => [
      {
        accessorFn: (row) => row.testregelId,
        id: '_idTestregel',
        cell: (info) => info.getValue(),
        header: () => <>Testregel</>,
      },
      {
        accessorFn: (row) => row.suksesskriterium,
        id: '_idSuksesskriterium',
        cell: ({ row }) => <>{row.original.suksesskriterium.join(', ')}</>,
        header: () => <>Suksesskriterium</>,
      },
      {
        accessorFn: (row) => row.elementResultat,
        id: '_elementUtfall',
        cell: (info) => (
          <StatusBadge
            label={info.getValue()}
            levels={{
              primary: 'ikkje forekomst',
              danger: 'brot',
              success: 'samsvar',
            }}
          />
        ),
        header: () => <>Status</>,
      },
      {
        accessorFn: (row) => row.side,
        id: 'side',
        cell: (info) => (
          <a href={String(info.getValue())}>{String(info.getValue())}</a>
        ),
        header: () => <>Nettside</>,
      },

      {
        accessorFn: (row) => row.elementOmtale.htmlCode,
        id: 'htmlCode',
        cell: (info) => <>{decodeBase64(String(info.getValue()))}</>,
        header: () => <>HTML element</>,
      },
      {
        accessorFn: (row) => row.elementOmtale.pointer,
        id: 'pointer',
        cell: (info) => info.getValue(),
        header: () => <>Peker</>,
      },
    ],
    []
  );

  const selectedLoeysing = maaling?.testResult.find(
    (tr) => tr.loeysing.id === Number(loeysingId)
  );

  const fetchTestresultat = useCallback(() => {
    setLoading(true);
    setError(undefined);

    const doFetchTestresultat = async () => {
      try {
        if (maaling) {
          if (selectedLoeysing) {
            const resultat = await fetchTestResultatLoeysing(
              maaling.id,
              Number(loeysingId)
            );
            setTestresult(resultat);
          } else {
            setError(new Error('Testresultat finnes ikkje for løysing'));
          }
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

  if (error) {
    return <ErrorCard error={error} />;
  } else if (!selectedLoeysing) {
    return (
      <ErrorCard error={new Error('Testresultat finnes ikkje for løysing')} />
    );
  }

  return (
    <>
      <AppTitle
        heading="Testresultat"
        subHeading={selectedLoeysing?.loeysing?.namn}
      />
      <TestlabTable<TestResultat>
        data={testResult}
        defaultColumns={testResultatColumns}
        displayError={{ error }}
        loading={loading}
        onClickRetry={fetchTestresultat}
      />
    </>
  );
};

export default TestResultListApp;
