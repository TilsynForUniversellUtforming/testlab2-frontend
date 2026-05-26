import { createRetest, deleteTestgrunnlag } from '@test/api/testing-api';
import { DeleteTestgrunnlagRequest, RetestRequest } from '@test/api/types';
import { ActionFunctionArgs } from 'react-router-dom';

export const testOverviewAction = async ({ request }: ActionFunctionArgs) => {
  switch (request.method) {
    case 'POST': {
      const retestRequest = (await request.json()) as RetestRequest;
      return await createRetest(retestRequest);
    }
    case 'DELETE': {
      const deleteRetestRequest = (await request.json()) as DeleteTestgrunnlagRequest;
      return await deleteTestgrunnlag(deleteRetestRequest);
    }
    default:
      return null;
  }
};

