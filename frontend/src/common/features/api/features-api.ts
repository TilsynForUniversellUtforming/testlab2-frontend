import { responseWithLogErrors } from '../../util/apiUtils';
import { fetchWithErrorHandling } from '../../form/util';
import { Feature } from './types';

const fetchFeatures = async (): Promise<Feature[]> =>
  fetchWithErrorHandling('/api/v1/features', {
    method: 'GET',
  }).then((response) =>
    responseWithLogErrors(response, 'Kunne ikke hente features')
  );

export default fetchFeatures;
