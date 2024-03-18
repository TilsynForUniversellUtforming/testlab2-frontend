import AppTitle from '@common/app-title/AppTitle';
import useContentDocumentTitle from '@common/hooks/useContentDocumentTitle';
import useLoading from '@common/hooks/useLoading';
import TestlabTable from '@common/table/TestlabTable';
import { getFullPath, idPath } from '@common/util/routeUtils';
import { Tabs } from '@digdir/designsystemet-react';
import { Loeysing } from '@loeysingar/api/types';
import { getLoeysingColumnsReadOnly } from '@loeysingar/list/LoeysingColumns';
import { LOEYSING_EDIT } from '@loeysingar/LoeysingRoutes';
import { MAALING } from '@maaling/MaalingRoutes';
import MaalingEdit from '@sak/MaalingEdit';
import { TestregelBase } from '@testreglar/api/types';
import { TESTREGEL_EDIT } from '@testreglar/TestregelRoutes';
import { getTestregelColumnsReadOnly } from '@testreglar/testreglar-liste/TestregelColumns';
import React, { useCallback, useMemo, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';

import { MaalingContext } from '../types';
import MaalingOverview from './MaalingOverview';

const MaalingOverviewWrapper = () => {
  const { maaling, contextError, refresh, maalingList }: MaalingContext =
    useOutletContext();
  const { id } = useParams();
  const maalingName =
    maalingList.find((m) => m.id === Number(id))?.navn || maaling?.navn;
  const [loading] = useLoading(maaling?.id !== Number(id));
  const [activeTab, setActiveTab] = useState<string>('oversikt');
  const onChangeTabs = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const loeysingColumns = useMemo(() => getLoeysingColumnsReadOnly(), []);
  const testregelColumns = useMemo(() => getTestregelColumnsReadOnly(), []);
  const displayError = {
    onClick: refresh,
    buttonText: 'Prøv igjen',
    error: contextError,
  };

  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noreferrer');
  };

  useContentDocumentTitle(MAALING.navn, maalingName);

  return (
    <>
      <AppTitle heading="Måling" subHeading={maalingName} />
      <Tabs value={activeTab} onChange={onChangeTabs}>
        <Tabs.List>
          <Tabs.Tab value="oversikt">Oversikt</Tabs.Tab>
          <Tabs.Tab value="redigermaaling">Rediger måling</Tabs.Tab>
          <Tabs.Tab value="nettloeysingar">Nettløysingar</Tabs.Tab>
          <Tabs.Tab value="testreglar">Testreglar</Tabs.Tab>
        </Tabs.List>
        <Tabs.Content value="oversikt">
          <MaalingOverview />
        </Tabs.Content>
        <Tabs.Content value="redigermaaling">
          <MaalingEdit onChangeTabs={onChangeTabs} />
        </Tabs.Content>
        <Tabs.Content value="nettloeysingar">
          <TestlabTable<Loeysing>
            defaultColumns={loeysingColumns}
            data={maaling?.loeysingList ?? []}
            loading={loading}
            displayError={displayError}
            onClickRow={(row) =>
              openInNewTab(
                getFullPath(LOEYSING_EDIT, {
                  pathParam: idPath,
                  id: String(row?.original.id),
                })
              )
            }
          />
        </Tabs.Content>
        <Tabs.Content value="testreglar">
          <TestlabTable<TestregelBase>
            defaultColumns={testregelColumns}
            data={maaling?.testregelList ?? []}
            loading={loading}
            displayError={displayError}
            onClickRow={(row) =>
              openInNewTab(
                getFullPath(TESTREGEL_EDIT, {
                  pathParam: idPath,
                  id: String(row?.original.id),
                })
              )
            }
          />
        </Tabs.Content>
      </Tabs>
    </>
  );
};

export default MaalingOverviewWrapper;
