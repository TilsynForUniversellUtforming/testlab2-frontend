import { responseToJson } from '@common/util/apiUtils';
import { Regelsett } from '@testreglar/api/types';

export const fetchRegelsettList = async (
  includeTestreglar: boolean = false,
  includeInactive: boolean = false
): Promise<Regelsett[]> => {
  const params = new URLSearchParams();
  params.append('includeTestreglar', includeTestreglar.toString());
  params.append('includeInactive', includeInactive.toString());

  return await fetch(`/api/v1/regelsett?${params.toString()}`, {
    method: 'GET',
  }).then((response) => responseToJson(response, 'Kunne ikke hente regelsett'));
};
