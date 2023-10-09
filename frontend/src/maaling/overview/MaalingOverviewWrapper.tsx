import AppTitle from '@common/app-title/AppTitle';
import appRoutes, { getFullPath, idPath } from '@common/appRoutes';
import useContentDocumentTitle from '@common/hooks/useContentDocumentTitle';
import useLoading from '@common/hooks/useLoading';
import TestlabTable from '@common/table/TestlabTable';
import { Tabs } from '@digdir/design-system-react';
import { Loeysing } from '@loeysingar/api/types';
import { getLoeysingColumnsReadOnly } from '@loeysingar/list/LoeysingColumns';
import MaalingEdit from '@sak/MaalingEdit';
import React, { useMemo } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';

import { Testregel } from '../../testreglar/api/types';
import { getTestregelColumnsReadOnly } from '../../testreglar/testreglar-liste/TestregelColumns';
import { MaalingContext } from '../types';
import MaalingOverview from './MaalingOverview';

const MaalingOverviewWrapper = () => {
  const { maaling, contextError, refresh, maalingList }: MaalingContext =
    useOutletContext();
  const { id } = useParams();
  const maalingName =
    maalingList.find((m) => m.id === Number(id))?.navn || maaling?.navn;
  const [loading] = useLoading(maaling?.id !== Number(id));

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

  useContentDocumentTitle(appRoutes.MAALING.navn, maalingName);

  return (
    <>
      <AppTitle heading="Måling" subHeading={maalingName} />
      <Tabs
        items={[
          {
            name: 'Oversikt',
            content: <MaalingOverview />,
          },
          {
            name: 'Rediger måling',
            content: <MaalingEdit />,
          },
          {
            name: 'Nettløysingar',
            content: (
              <TestlabTable<Loeysing>
                defaultColumns={loeysingColumns}
                data={maaling?.loeysingList ?? []}
                loading={loading}
                displayError={displayError}
                onClickRow={(row) =>
                  openInNewTab(
                    getFullPath(appRoutes.LOEYSING_EDIT, {
                      pathParam: idPath,
                      id: String(row?.original.id),
                    })
                  )
                }
              />
            ),
          },
          {
            name: 'Testreglar',
            content: (
              <TestlabTable<Testregel>
                defaultColumns={testregelColumns}
                data={maaling?.testregelList ?? []}
                loading={loading}
                displayError={displayError}
                onClickRow={(row) =>
                  openInNewTab(
                    getFullPath(appRoutes.TESTREGEL_EDIT, {
                      pathParam: idPath,
                      id: String(row?.original.id),
                    })
                  )
                }
              />
            ),
          },
        ]}
      />
    </>
  );
};

export default MaalingOverviewWrapper;
