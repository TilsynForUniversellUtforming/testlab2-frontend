import { responseToJson } from '../../common/util/api/util';
import {
  RegelsettRequest,
  Testregel,
  TestregelCreateRequest,
  TestregelEditRequest,
  TestRegelsett,
} from './types';

export const listTestreglar = async (): Promise<Testregel[]> =>
  await fetch(`/api/v1/testreglar`, {
    method: 'GET',
  }).then((response) =>
    responseToJson(response, 'Kunne ikke hente testreglar')
  );

export const listRegelsett = async (): Promise<TestRegelsett[]> =>
  await fetch(`/api/v1/testreglar/regelsett`, {
    method: 'GET',
  }).then((response) => responseToJson(response, 'Kunne ikke hente regelsett'));

export const createTestregel = async (
  testregel: TestregelCreateRequest
): Promise<Testregel[]> =>
  await fetch(`/api/v1/testreglar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testregel),
  }).then((response) =>
    responseToJson(response, 'Kunne ikke lage nytt testregel')
  );

export const createRegelsett = async (
  regelsett: RegelsettRequest
): Promise<TestRegelsett[]> =>
  await fetch(`/api/v1/testreglar/regelsett`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(regelsett),
  }).then((response) =>
    responseToJson(response, 'Kunne ikke lage nytt regelsett')
  );

export const updateTestregel = async (
  testregelEditRequest: TestregelEditRequest
): Promise<Testregel[]> =>
  await fetch(`/api/v1/testreglar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testregelEditRequest),
  }).then((response) =>
    responseToJson(response, 'Kunne ikke oppdatere testregel')
  );

export const updateRegelsett = async (
  regelsett: TestRegelsett
): Promise<TestRegelsett[]> =>
  await fetch(`/api/v1/testreglar/regelsett`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(regelsett),
  }).then((response) =>
    responseToJson(response, 'Kunne ikke oppdatere regelsett')
  );

export const deleteTestregel = async (id: number): Promise<Testregel[]> =>
  await fetch(`/api/v1/testreglar/${id}`, {
    method: 'DELETE',
  }).then((response) =>
    responseToJson(response, 'Kunne ikke slette testregel')
  );

export const deleteRegelsett = async (id: number) =>
  await fetch(`/api/v1/testreglar/regelsett/${id}`, {
    method: 'DELETE',
  }).then((response) =>
    responseToJson(response, 'Kunne ikke slette regelsett')
  );
