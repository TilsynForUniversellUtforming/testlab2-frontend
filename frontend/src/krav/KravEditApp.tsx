import React, { useCallback, useState } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';

import { updateKrav } from './api/krav-api';
import { Krav } from './types';
import KravForm from './KravForm';

function KravEdit() {
  const { id } = useParams();
  const kravInit = useLoaderData() as Krav;

  const [krav, setKrav] = useState<Krav>(kravInit);

  const onSubmit = useCallback((data: Krav) => {
    console.log(data);

    const update = async () => {
      data.id = Number(id);
      updateKrav(data).then((response) => setKrav(response));
    };
    update();
  }, []);

  return <KravForm krav={krav} onSubmit={onSubmit} />;
}

export default KravEdit;
