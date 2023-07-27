import AppTitle from '@common/app-title/AppTitle';
import TestlabTable from '@common/table/TestlabTable';
import { Tabs } from '@digdir/design-system-react';
import React, { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';

import { Loeysing } from '../../loeysingar/api/types';
import { getLoeysingColumnsReadOnly } from '../../loeysingar/list/LoeysingColumns';
import SakEdit from '../../sak/SakEdit';
import { Testregel } from '../../testreglar/api/types';
import { getTestregelColumnsReadOnly } from '../../testreglar/testreglar-liste/TestregelColumns';
import { MaalingContext } from '../types';
import MaalingOverview from './MaalingOverview';

const MaalingOverviewWrapper = () => {
  const context: MaalingContext = useOutletContext();
  const { maaling, contextLoading, contextError, refresh } = context;

  const loeysingColumns = useMemo(() => getLoeysingColumnsReadOnly(), []);
  const testregelColumns = useMemo(() => getTestregelColumnsReadOnly(), []);
  const displayError = {
    onClick: refresh,
    buttonText: 'Prøv igjen',
    error: contextError,
  };

  return (
    <>
      <AppTitle heading={maaling?.navn ?? ''} />
      <Tabs
        items={[
          {
            name: 'Oversikt',
            content: <MaalingOverview />,
          },
          {
            name: 'Rediger måling',
            content: <SakEdit />,
          },
          {
            name: 'Nettløysingar',
            content: (
              <TestlabTable<Loeysing>
                defaultColumns={loeysingColumns}
                data={maaling?.loeysingList ?? []}
                filterPreference="rowsearch"
                loading={contextLoading}
                displayError={displayError}
              />
            ),
          },
          {
            name: 'Testreglar',
            content: (
              <TestlabTable<Testregel>
                defaultColumns={testregelColumns}
                data={maaling?.testregelList ?? []}
                filterPreference="rowsearch"
                loading={contextLoading}
                displayError={displayError}
              />
            ),
          },
        ]}
      />
    </>
  );
};

export default MaalingOverviewWrapper;
