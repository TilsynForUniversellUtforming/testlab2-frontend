import { Spinner } from '@digdir/designsystemet-react';
import { InngaaendeTestLoadingResponseKontroll } from '@test/types';
import { Suspense } from 'react';
import { Await, Outlet, useLoaderData } from 'react-router-dom';

const InngaaendeTestAppKontroll = () => {
  const data =
    useLoaderData() as Promise<InngaaendeTestLoadingResponseKontroll>;

  return (
    <Suspense fallback={<Spinner title="Hentar test" />}>
      <Await resolve={data}>
        {(data) => (
          <Outlet
            context={{
              contextKontroll: data.kontroll,
              testgrunnlag: data.testgrunnlag,
              sideutvalTypeList: data.sideutvalTypeList,
              innhaldstypeList: data.innhaldstypeTestingList,
            }}
          />
        )}
      </Await>
    </Suspense>
  );
};

export default InngaaendeTestAppKontroll;
