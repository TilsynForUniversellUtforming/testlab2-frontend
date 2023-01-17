import { useEffect, useState } from 'react';

import Title from '../common/title/Title';

type KravType = {
  id: number;
  tittel: string;
  status: string;
  innhald: string;
  gjeldautomat: boolean;
  gjeldnettsider: boolean;
  gjeldapp: boolean;
  urlrettleiing: string;
}[];
const KravApp = () => <Title title="Krav" />;

export default KravApp;
