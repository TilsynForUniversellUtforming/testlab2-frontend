import './kvalitetssikring.scss';

import { Spinner } from '@digdir/design-system-react';
import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

import AppTitle from '../../common/app-title/AppTitle';
import { appRoutes, getFullPath, idPath } from '../../common/appRoutes';
import ConfirmModalButton from '../../common/confirm/ConfirmModalButton';
import ErrorCard from '../../common/error/ErrorCard';
import { RowCheckbox } from '../../common/table/control/toggle/IndeterminateCheckbox';
import TestlabTable from '../../common/table/TestlabTable';
import { restartCrawling } from '../../maaling/api/maaling-api';
import { CrawlUrl } from '../../maaling/types';
import { TesterContext } from '../types';

const KvalitetssikringApp = () => {
  const { loeysingId } = useParams();
  const { contextError, contextLoading, maaling, setMaaling }: TesterContext =
    useOutletContext();
  const [loading, setLoading] = useState(contextLoading);
  const [error, setError] = useState(contextError);
  const [urlRowSelection, setUrlRowSelection] = useState<CrawlUrl[]>([]);
  const navigate = useNavigate();

  if (contextLoading) {
    return <Spinner title="Hentar sak" variant={'default'} />;
  }

  const crawlResultat = maaling?.crawlResultat;
  const loeysingCrawResultat = crawlResultat?.find(
    (m) => String(m.loeysing.id) === loeysingId
  );

  if (typeof maaling === 'undefined') {
    return <ErrorCard errorText="Maaling finnes ikkje" />;
  } else if (typeof crawlResultat === 'undefined') {
    return <ErrorCard errorText="Finner ikkje resultat etter sideutval" />;
  } else if (typeof loeysingId === 'undefined') {
    return <ErrorCard errorText="Løsysing eksisterar ikkje på måling" />;
  } else if (typeof loeysingCrawResultat === 'undefined') {
    return (
      <ErrorCard errorText="Sideutval på løsysing eksisterar ikkje på måling" />
    );
  }

  const crawlUrls: CrawlUrl[] =
    loeysingCrawResultat.urlList?.map((url) => ({
      url,
    })) ?? [];

  const onClickRestart = useCallback(() => {
    setLoading(true);
    setError(undefined);

    const fetchData = async () => {
      try {
        const restartedMaaling = await restartCrawling(
          maaling.id,
          loeysingCrawResultat.loeysing.id
        );
        setMaaling(restartedMaaling);
      } catch (e) {
        setError('Noko gikk gale ved restart av sideutval');
      }
    };

    fetchData().finally(() => {
      setLoading(false);
      navigate(
        getFullPath(appRoutes.TEST_SIDEUTVAL_LIST, {
          id: String(maaling.id),
          pathParam: idPath,
        })
      );
    });
  }, []);

  const onClickDeleteLoeysing = useCallback(() => {
    console.log('Sletter løsning');
  }, []);

  const onClickRemoveUrl = useCallback(() => {
    console.log(urlRowSelection);
  }, [urlRowSelection]);

  const onSelectRows = useCallback((rowSelection: CrawlUrl[]) => {
    setUrlRowSelection(rowSelection);
  }, []);

  const urlColumns = useMemo<ColumnDef<CrawlUrl>[]>(
    () => [
      {
        id: 'Handling',
        cell: ({ row }) => <RowCheckbox row={row} />,
        size: 1,
      },
      {
        accessorFn: (row) => row.url,
        id: 'url',
        cell: ({ row }) => <a href={row.original.url}>{row.original.url}</a>,
        header: () => <span>URL</span>,
      },
    ],
    []
  );
  return (
    <>
      <AppTitle
        heading="Sideutvalg"
        subHeading={loeysingCrawResultat.loeysing.url}
      />
      <div className="kvalitetssikring__user-actions">
        <ConfirmModalButton
          onConfirm={onClickRemoveUrl}
          message={`Vil du slette ${urlRowSelection.length} løysingar frå måling?`}
          title="Fjern valgte nettsider frå måling"
          disabled={urlRowSelection.length === 0 || loading}
        />
        <ConfirmModalButton
          message={`Vil du slette ${loeysingCrawResultat.loeysing.url} frå måling?`}
          onConfirm={onClickDeleteLoeysing}
          disabled={loading}
          title="Ta nettsted ut av måling"
        />
        <ConfirmModalButton
          message={`Vil du starte crawling av ${loeysingCrawResultat.loeysing.url} på nytt?`}
          onConfirm={onClickRestart}
          disabled={loading}
          title="Nytt sideutval for nettstad"
        />
      </div>
      <TestlabTable<CrawlUrl>
        data={crawlUrls}
        defaultColumns={urlColumns}
        onSelectRows={onSelectRows}
        fetchError={error}
        loading={loading}
        filterPreference={'searchbar'}
      />
    </>
  );
};

export default KvalitetssikringApp;
