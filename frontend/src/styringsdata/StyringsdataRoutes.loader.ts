import { isDefined } from '@common/util/validationUtils';
import { getIdFromParams } from '@test/util/testregelUtils';
import { fetchVerksemd } from '@verksemder/api/verksemd-api';
import { LoaderFunctionArgs } from 'react-router-dom';

import { fetchKontroll } from '../kontroll/kontroll-api';
import { Kontroll } from '../kontroll/types';
import {
  fetchStyringsdataKontroll,
  fetchStyringsdataLoeysing,
} from './api/styringsdata-api';
import {
  StyringsdataKontroll,
  StyringsdataKontrollLoaderData,
  StyringsdataLoaderData,
  StyringsdataLoeysing,
} from './types';

export const styringsdataLoaderKontroll = async ({
  params,
  request,
}: LoaderFunctionArgs): Promise<StyringsdataKontrollLoaderData> => {
  const kontrollId = getIdFromParams(params?.kontrollId);

  const url = new URL(request.url);
  const styringsdataParam = url.searchParams.get('styringsdataId');

  const kontrollResponse = await fetchKontroll(kontrollId);

  if (!kontrollResponse.ok) {
    if (kontrollResponse.status === 404) {
      throw new Error('Det finnes ikke en kontroll med id ' + kontrollId);
    } else {
      throw new Error('Klarte ikke å hente kontrollen.');
    }
  }
  const kontroll: Kontroll = await kontrollResponse.json();

  let styringsdataKontroll: StyringsdataKontroll | undefined = undefined;
  if (isDefined(styringsdataParam)) {
    const styringsdataId = Number(styringsdataParam);
    styringsdataKontroll = await fetchStyringsdataKontroll(styringsdataId);
  }

  return {
    kontrollTittel: kontroll.tittel,
    arkivreferanse: kontroll.arkivreferanse,
    styringsdata: styringsdataKontroll,
  };
};

export const styringsdataLoader = async ({
  params,
  request,
}: LoaderFunctionArgs): Promise<StyringsdataLoaderData> => {
  const kontrollId = getIdFromParams(params?.kontrollId);
  const loeysingId = getIdFromParams(params?.loeysingId);
  const verksemdId = params?.verksemdId;

  const url = new URL(request.url);
  const styringsdataParam = url.searchParams.get('styringsdataId');

  const kontrollResponse = await fetchKontroll(kontrollId);

  if (!kontrollResponse.ok) {
    if (kontrollResponse.status === 404) {
      throw new Error('Det finnes ikke en kontroll med id ' + kontrollId);
    } else {
      throw new Error('Klarte ikke å hente kontrollen.');
    }
  }
  const kontroll: Kontroll = await kontrollResponse.json();

  const loeysing = kontroll.utval?.loeysingar?.find((l) => l.id === loeysingId);
  let verksemdNamn = loeysing?.orgnummer ?? '';
  if (loeysing?.verksemdId || isDefined(verksemdId)) {
    const verksemd = await fetchVerksemd(
      loeysing?.verksemdId ?? Number(verksemdId)
    );
    verksemdNamn = verksemd.namn;
  }

  let styringsdata: StyringsdataLoeysing | undefined = undefined;
  if (isDefined(styringsdataParam)) {
    const styringsdataId = Number(styringsdataParam);
    styringsdata = await fetchStyringsdataLoeysing(styringsdataId);
  }

  return {
    kontrollTittel: kontroll.tittel,
    arkivreferanse: kontroll.arkivreferanse,
    loeysingNamn: loeysing?.namn ?? '',
    styringsdata: styringsdata,
    verksemdNamn: verksemdNamn,
  };
};
