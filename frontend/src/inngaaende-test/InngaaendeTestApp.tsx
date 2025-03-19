import { Spinner } from '@digdir/designsystemet-react';
import { InngaaendeTestLoadingResponseKontroll } from '@test/types';
import { Suspense } from 'react';
import { Await, Outlet, useLoaderData } from 'react-router-dom';

const InngaaendeTestApp = () => {
  const data =
    useLoaderData() as Promise<InngaaendeTestLoadingResponseKontroll>;

  return (
    <Suspense fallback={<Spinner title="Hentar test" />}>
      <Await resolve={data}>
        <Outlet />
      </Await>
    </Suspense>
  );
};

export default InngaaendeTestApp;
