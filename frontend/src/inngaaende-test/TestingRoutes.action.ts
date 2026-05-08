import { createRetest, deleteTestgrunnlag } from '@test/api/testing-api';
import { RetestRequest } from '@test/api/types';
import { Testgrunnlag } from '@test/types';
import { ActionFunctionArgs } from 'react-router-dom';

export const testOverviewAction = async ({ request }: ActionFunctionArgs) => {
  switch (request.method) {
    case 'POST': {
      const retestRequest = (await request.json()) as RetestRequest;
      return await createRetest(retestRequest);
    }
    case 'DELETE': {
      const testgrunnlag: Testgrunnlag = await request.json();
      return await deleteTestgrunnlag(testgrunnlag);
    }
    default:
      return null;
  }
};

