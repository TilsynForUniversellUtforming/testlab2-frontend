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
              contextSak: data.sak,
              testgrunnlag: data.testgrunnlag,
              innhaldstypeList: data.innhaldstypeTestingList,
            }}
          />
        )}
      </Await>
    </Suspense>
  );
};

export default InngaaendeTestApp;
