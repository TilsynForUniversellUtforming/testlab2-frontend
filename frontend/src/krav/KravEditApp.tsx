import React, { useCallback, useState } from 'react';
import { useLoaderData, useParams } from 'react-router';

import { updateKrav } from './api/krav-api';
import { Krav, KravInit } from './types';
import KravForm from './KravForm';

function KravEdit() {
  const { id } = useParams();
  const kravInit = useLoaderData() as Krav;

  const [krav, setKrav] = useState<Krav>(kravInit);

  const onSubmit = useCallback(
    (data: KravInit) => {
      console.log(data);

      const update = async () => {
        const updatedKrav: Krav = { ...data, id: Number(id) };
        updateKrav(updatedKrav).then((response) => setKrav(response));
      };
      update();
    },
    [id]
  );

  return <KravForm krav={krav} onSubmit={onSubmit} />;
}

export default KravEdit;
