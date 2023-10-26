import { responseToJson } from '../../util/apiUtils';
import { Feature } from './types';

const fetchFeatures = async (): Promise<Feature[]> =>
  fetch('/api/v1/features', {
    method: 'GET',
  }).then((response) => responseToJson(response, 'Kunne ikke hente features'));

export default fetchFeatures;
