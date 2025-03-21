import { fetchWithCsrf, fetchWithErrorHandling } from '@common/form/util';
import { responseWithLogErrors } from '@common/util/apiUtils';

import { Krav } from '../../krav/types';
import {
  InnhaldstypeTesting,
  Tema,
  Testobjekt,
  Testregel,
  TestregelBase,
  TestregelInit,
} from './types';

export const listTestreglar = async (): Promise<TestregelBase[]> =>
  await fetchWithErrorHandling(`/api/v1/testreglar`, {
    method: 'GET',
  }).then((response) =>
    responseWithLogErrors(response, 'Kunne ikke hente testreglar')
  );

export const listTestreglarWithMetadata = async (): Promise<Testregel[]> =>
  await fetchWithErrorHandling(`/api/v1/testreglar?includeMetadata=true`, {
    method: 'GET',
  }).then((response) =>
    responseWithLogErrors(response, 'Kunne ikke hente testreglar')
  );

export const getTestregel = async (id: number): Promise<Testregel> =>
  await fetchWithErrorHandling(`/api/v1/testreglar/${id}`, {
    method: 'GET',
  }).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje hente testregel')
  );

export const listInnhaldstype = async (): Promise<InnhaldstypeTesting[]> =>
  await fetchWithErrorHandling(`/api/v1/testreglar/innhaldstypeForTesting`, {
    method: 'GET',
  }).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje hente testregel')
  );

export const listTema = async (): Promise<Tema[]> =>
  await fetchWithErrorHandling(`/api/v1/testreglar/temaForTestreglar`, {
    method: 'GET',
  }).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje hente testregel')
  );

export const listTestobjekt = async (): Promise<Testobjekt[]> =>
  await fetchWithErrorHandling(`/api/v1/testreglar/testobjektForTestreglar`, {
    method: 'GET',
  }).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje hente testregel')
  );

export const createTestregel = async (
  testregel: TestregelInit
): Promise<TestregelBase[]> =>
  await fetchWithCsrf(`/api/v1/testreglar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testregel),
  }).then((response) =>
    responseWithLogErrors(response, 'Kunne ikkje lagre testregel')
  );

export const updateTestregel = async (
  testregel: TestregelInit
): Promise<TestregelBase[]> =>
  await fetchWithCsrf(`/api/v1/testreglar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testregel),
  }).then((response) =>
    responseWithLogErrors(response, 'Kunne ikke oppdatere testregel')
  );

export const deleteTestregelList = async (
  testregelIdList: number[]
): Promise<TestregelBase[]> =>
  await fetchWithErrorHandling(`/api/v1/testreglar`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idList: testregelIdList }),
  }).then((response) =>
    responseWithLogErrors(response, 'Kunne ikke slette testregel')
  );

export const getKrav = async (idKrav: number): Promise<Krav> => {
  return fetchWithErrorHandling(`/api/v1/testreglar/krav/${idKrav}`, {}).then(
    (response) => responseWithLogErrors(response, 'Kunne ikkje hente krav')
  );
};
