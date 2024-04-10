import useAlert from '@common/alert/useAlert';
import useContentDocumentTitle from '@common/hooks/useContentDocumentTitle';
import {
  Verksemd,
  VerksemdContext,
  VerksemdUpdate,
} from '@verksemder/api/types';
import VerksemdForm from '@verksemder/form/VerksemdForm';
import { VERKSEMD_EDIT } from '@verksemder/VerksemdRoutes';
import React, { useCallback, useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';

const getVerksemd = (verksemdList: Verksemd[], id: string | undefined) => {
  return verksemdList.find((v) => v.id === Number(id));
};
const VerksemdEdit = () => {
  const { verksemdList, contextLoading }: VerksemdContext = useOutletContext();
  const { id } = useParams();
  const [verksemd, setVerksemd] = useState(getVerksemd(verksemdList, id));
  const [loading, setLoading] = useState(contextLoading);
  const [alert] = useAlert();

  useEffect(() => {
    const foundVerksemd = getVerksemd(verksemdList, id);
    if (foundVerksemd) {
      setVerksemd(foundVerksemd);
      setLoading(false);
    }
  }, [verksemdList]);

  useContentDocumentTitle(VERKSEMD_EDIT.navn, verksemd?.namn);

  const onSubmit = useCallback(
    (verksemdEdit: VerksemdUpdate) => {
      console.log(verksemdEdit);
    },
    [verksemdList]
  );

  console.log('Verksemd ' + JSON.stringify(verksemd) + ' Loading ' + loading);

  return (
    <VerksemdForm
      heading="Endre løysing"
      description={verksemd?.namn}
      verksemd={verksemd}
      alert={alert}
      onSubmit={onSubmit}
    />
  );
};

export default VerksemdEdit;
