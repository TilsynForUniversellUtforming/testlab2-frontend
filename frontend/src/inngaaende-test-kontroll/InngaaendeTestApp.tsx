import { Spinner } from '@digdir/designsystemet-react';
import { Suspense } from 'react';
import { Await, Outlet, useLoaderData } from 'react-router-dom';

import { InngaaendeTestLoadingResponse } from './types';

const InngaaendeTestApp = () => {
  const data = useLoaderData() as Promise<InngaaendeTestLoadingResponse>;

  return (
    <Suspense fallback={<Spinner title="Hentar test" />}>
      <Await resolve={data}>
        {(data) => (
          <Outlet
            context={{
              contextKontroll: data.kontroll,
              contextLoeysingWithSideutval: data.loeysingWithSideutval,
              testgrunnlag: data.testgrunnlag,
              sideutvalType: data.sideutvalType,
              innhaldstypeList: data.innhaldstypeTestingList,
            }}
          />
        )}
      </Await>
    </Suspense>
  );
};

export default InngaaendeTestApp;
