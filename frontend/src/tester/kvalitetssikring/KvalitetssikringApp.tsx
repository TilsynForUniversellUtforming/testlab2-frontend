import React, { useCallback, useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

import AppTitle from '../../common/app-title/AppTitle';
import { appRoutes, getFullPath, idPath } from '../../common/appRoutes';
import ConfirmDialog from '../../common/confirm/ConfirmDialog';
import ErrorCard from '../../common/error/ErrorCard';
import { restartCrawling } from '../../maaling/api/maaling-api';
import { CrawlUrl } from '../../maaling/types';
import { TesterContext } from '../types';
import KvalitetssikringList from './KvalitetssikringList';

const KvalitetssikringApp = () => {
  const { loeysingId } = useParams();
  const { contextError, contextLoading, maaling, setMaaling }: TesterContext =
    useOutletContext();
  const [loading, setLoading] = useState(contextLoading);
  const [error, setError] = useState(contextError);
  const [urlRowSelection, setUrlRowSelection] = useState<CrawlUrl[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmLabel, setConfirmLabel] = useState<string>();

  const navigate = useNavigate();

  if (contextLoading) {
    return (
      <Spinner
        as="span"
        animation="border"
        size="sm"
        role="status"
        aria-hidden="true"
      />
    );
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
  } else if (typeof loeysingCrawResultat?.urlList === 'undefined') {
    return (
      <ErrorCard errorText="Sideutval på løsysing eksisterar ikkje på måling" />
    );
  }

  const crawlUrls: CrawlUrl[] = loeysingCrawResultat.urlList.map((url) => ({
    url,
  }));

  const onClickRestart = useCallback(() => {
    setConfirmLabel('Vil du starta sideutval på nytt?');
    setShowConfirm(true);
    setLoading(true);
  }, []);

  const doRestart = useCallback(() => {
    setShowConfirm(false);
    const fetchData = async () => {
      const restartedMaaling = await restartCrawling(
        maaling.id,
        loeysingCrawResultat.loeysing.id
      );
      setMaaling(restartedMaaling);
      setLoading(false);
      setError(undefined);
    };

    fetchData()
      .catch((e) => setError(e))
      .finally(() => {
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

  const onCloseModal = useCallback(() => {
    setShowConfirm(false);
  }, []);

  return (
    <>
      <AppTitle
        title="Sideutvalg"
        subTitle={loeysingCrawResultat.loeysing.url}
      />
      <div className="mb-3">
        <Button
          className="me-3"
          onClick={onClickRemoveUrl}
          disabled={urlRowSelection.length === 0 || loading}
        >
          Fjern valgte nettsted frå måling
        </Button>
        <Button
          className="me-3"
          onClick={onClickDeleteLoeysing}
          disabled={loading}
        >
          Ta nettsted ut av måling
        </Button>
        <Button onClick={onClickRestart} disabled={loading}>
          Nytt sideutval for nettstad
        </Button>
      </div>
      <ConfirmDialog
        label={confirmLabel}
        show={showConfirm}
        closeModal={onCloseModal}
        onSubmit={doRestart}
      />
      <KvalitetssikringList
        crawlUrls={crawlUrls}
        onSelectRows={onSelectRows}
        error={error}
        loading={loading}
      />
    </>
  );
};

export default KvalitetssikringApp;
