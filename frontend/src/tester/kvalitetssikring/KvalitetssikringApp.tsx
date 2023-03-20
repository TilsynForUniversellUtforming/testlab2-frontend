import React, { useCallback, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

import AppTitle from '../../common/app-title/AppTitle';
import { appRoutes, getFullPath, idPath } from '../../common/appRoutes';
import ConfirmModalButton from '../../common/confirm/ConfirmModalButton';
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

  const navigate = useNavigate();

  if (contextLoading) {
    return <span>SPINNER</span>;
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
    setLoading(true);
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

  return (
    <>
      <AppTitle
        title="Sideutvalg"
        subTitle={loeysingCrawResultat.loeysing.url}
      />
      <div className="mb-3">
        <ConfirmModalButton
          className="me-3"
          onConfirm={onClickRemoveUrl}
          message={`Vil du slette ${urlRowSelection.length} løysingar frå måling?`}
          label="Fjern valgte nettsted frå måling"
          disabled={urlRowSelection.length === 0 || loading}
        />
        <ConfirmModalButton
          className="me-3"
          message={`Vil du slette ${loeysingCrawResultat.loeysing.url} frå måling?`}
          onConfirm={onClickDeleteLoeysing}
          disabled={loading}
          label="Ta nettsted ut av måling"
        />
        <ConfirmModalButton
          className="me-3"
          message={`Vil du starte crawling av ${loeysingCrawResultat.loeysing.url} på nytt?`}
          onConfirm={onClickRestart}
          disabled={loading}
          label="Nytt sideutval for nettstad"
        />
      </div>
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
