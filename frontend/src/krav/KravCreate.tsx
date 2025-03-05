import KravForm from './KravForm';
import { useCallback } from 'react';
import { KravInit } from './types';
import { createKrav } from './api/krav-api';
import { useNavigate } from 'react-router-dom';

const KravCreate = () => {
  const navidation = useNavigate();

  const onSubmit = useCallback(async (data: KravInit) => {
    console.log('onSubmitt krav ' + JSON.stringify(data));

    const create = async (): Promise<number> => {
      return await createKrav(data).then((response) => {
        console.log('KravCreate response ' + response);
        return response;
      });
    };
    const kravId = await create();
    navidation('/krav/' + kravId);
  }, []);

  return <KravForm onSubmit={onSubmit} />;
};

export default KravCreate;
