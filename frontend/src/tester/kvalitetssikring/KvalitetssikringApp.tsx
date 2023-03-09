import React from 'react';
import { Spinner } from 'react-bootstrap';
import { useOutletContext, useParams } from 'react-router-dom';

import ErrorCard from '../../common/error/ErrorCard';
import { CrawlUrl } from '../../maaling/types';
import { TesterContext } from '../types';
import KvalitetssikringList from './KvalitetssikringList';

const KvalitetssikringApp = () => {
  const { loeysingId } = useParams();
  const { error, loading, maaling }: TesterContext = useOutletContext();

  if (loading) {
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
  } else if (
    typeof crawlResultat === 'undefined' ||
    crawlResultat?.length === 0
  ) {
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

  return (
    <KvalitetssikringList error={error} loading={loading} urls={crawlUrls} />
  );
};

export default KvalitetssikringApp;
