import './kvalitetssikring.scss';

import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

import AppTitle from '../../common/app-title/AppTitle';
import AppRoutes, {
  appRoutes,
  getFullPath,
  idPath,
} from '../../common/appRoutes';
import ConfirmModalButton from '../../common/confirm/ConfirmModalButton';
import toError from '../../common/error/util';
import { RowCheckbox } from '../../common/table/control/toggle/IndeterminateCheckbox';
import TestlabTable from '../../common/table/TestlabTable';
import { extractDomain } from '../../common/util/stringutils';
import { restartCrawling } from '../../maaling/api/maaling-api';
import {
  CrawlResultat,
  Maaling,
  RestartCrawlRequest,
} from '../../maaling/api/types';
import { CrawlUrl, MaalingContext } from '../../maaling/types';

const getLoeysingCrawlResultat = (
  loeysingId?: string,
  maaling?: Maaling
): CrawlResultat | undefined =>
  maaling?.crawlResultat?.find((m) => String(m.loeysing.id) === loeysingId);

const KvalitetssikringApp = () => {
  const navigate = useNavigate();
  const { id: maalingId, loeysingId } = useParams();

  const { contextError, contextLoading, maaling, setMaaling }: MaalingContext =
    useOutletContext();
  const [loading, setLoading] = useState(contextLoading);
  const [error, setError] = useState(contextError);
  const [urlRowSelection, setUrlRowSelection] = useState<CrawlUrl[]>([]);
  const [loeysingCrawlResultat, setLoeysingCrawlResultat] = useState<
    CrawlResultat | undefined
  >(getLoeysingCrawlResultat(loeysingId, maaling));

  useEffect(() => {
    setLoading(contextLoading);
    if (!contextLoading) {
      setLoeysingCrawlResultat(getLoeysingCrawlResultat(loeysingId, maaling));
    }
  }, [contextLoading]);

  const crawlResultat = maaling?.crawlResultat;
  const loeysingCrawResultat = crawlResultat?.find(
    (m) => String(m.loeysing.id) === loeysingId
  );

  const onClickRestart = useCallback(() => {
    setLoading(true);
    setError(undefined);

    const fetchData = async () => {
      try {
        if (maalingId && loeysingId) {
          const restartCrawlingRequest: RestartCrawlRequest = {
            maalingId: Number(maalingId),
            loeysingIdList: { idList: [Number(loeysingId)] },
          };

          const restartedMaaling = await restartCrawling(
            restartCrawlingRequest
          );
          setMaaling(restartedMaaling);

          navigate(
            getFullPath(appRoutes.TEST_SIDEUTVAL_LIST, {
              id: maalingId,
              pathParam: idPath,
            })
          );
        } else {
          setError(new Error('Testresultat finnes ikkje'));
        }
      } catch (e) {
        setError(toError(e, 'Noko gikk gale ved omstart av sideutval'));
      }
    };

    fetchData().finally(() => {
      setLoading(false);
    });
  }, []);

  const onClickDeleteLoeysing = useCallback(() => {
    console.log('Sletter løysing');
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
        cell: ({ row }) => (
          <RowCheckbox row={row} ariaLabel={`Velg ${row.original.url}`} />
        ),
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
        heading={`Sideutval ${extractDomain(
          loeysingCrawResultat?.loeysing.url
        )}`}
        subHeading={`Måling: ${maaling?.navn}`}
        linkPath={
          maaling
            ? getFullPath(AppRoutes.MAALING, {
                id: String(maaling.id),
                pathParam: idPath,
              })
            : undefined
        }
      />
      <div className="kvalitetssikring__user-actions">
        <ConfirmModalButton
          onConfirm={onClickRemoveUrl}
          message={`Vil du sletta ${urlRowSelection.length} løysingar frå måling?`}
          title="Fjern valgte nettsider frå måling"
          disabled={urlRowSelection.length === 0 || loading}
          buttonVariant="button"
        />
        <ConfirmModalButton
          message={`Vil du sletta ${loeysingCrawResultat?.loeysing.url} frå måling?`}
          onConfirm={onClickDeleteLoeysing}
          disabled={loading}
          title="Ta nettsted ut av måling"
          buttonVariant="button"
        />
        {maaling?.status === 'kvalitetssikring' && (
          <ConfirmModalButton
            message={`Vil du starta crawling av ${loeysingCrawResultat?.loeysing.url} på nytt?`}
            onConfirm={onClickRestart}
            disabled={loading}
            title="Nytt sideutval for nettstad"
            buttonVariant="button"
          />
        )}
      </div>
      <TestlabTable<CrawlUrl>
        data={
          loeysingCrawlResultat?.urlList?.map((url) => ({
            url,
          })) ?? []
        }
        defaultColumns={urlColumns}
        onSelectRows={onSelectRows}
        displayError={{ error }}
        loading={loading}
        filterPreference={'searchbar'}
      />
    </>
  );
};

export default KvalitetssikringApp;
