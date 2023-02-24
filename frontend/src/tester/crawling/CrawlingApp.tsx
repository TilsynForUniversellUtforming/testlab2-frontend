import React from 'react';
import { useOutletContext } from 'react-router-dom';

import { TesterContext } from '../types';
import CrawlingList from './CrawlingList';

const CrawlingApp = () => {
  const { maaling, error, loading }: TesterContext = useOutletContext();

  const crawlList = maaling?.crawlResultat;

  if (
    typeof crawlList === 'undefined' ||
    (crawlList && crawlList.length === 0)
  ) {
    return null;
  }

  return <CrawlingList crawlList={crawlList} error={error} loading={loading} />;
};

export default CrawlingApp;
