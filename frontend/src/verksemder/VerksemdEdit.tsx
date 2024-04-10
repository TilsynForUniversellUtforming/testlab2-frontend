import useAlert from '@common/alert/useAlert';
import useContentDocumentTitle from '@common/hooks/useContentDocumentTitle';
import {
  Verksemd,
  VerksemdContext,
  VerksemdUpdate,
} from '@verksemder/api/types';
import { updateVerksemd } from '@verksemder/api/verksemd-api';
import VerksemdForm from '@verksemder/form/VerksemdForm';
import { VERKSEMD_EDIT } from '@verksemder/VerksemdRoutes';
import React, { useCallback, useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';

const getVerksemd = (verksemdList: Verksemd[], id: string | undefined) => {
  return verksemdList.find((v) => v.id === Number(id));
};
const VerksemdEdit = () => {
  const { verksemdList, contextLoading, setVerksemdList }: VerksemdContext =
    useOutletContext();
  const { id } = useParams();
  const [verksemd, setVerksemd] = useState(getVerksemd(verksemdList, id));
  const [, setLoading] = useState(contextLoading);
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
      const doEditVerksemd = async () => {
        if (verksemdEdit && id) {
          setLoading(true);
          const verksemd: Verksemd = { ...verksemdEdit, id: Number(id) };
          const updated = await updateVerksemd(verksemd);
          setVerksemdList(updated);
          console.log(verksemd);
        }
      };
      doEditVerksemd();
      console.log(verksemdEdit);
    },
    [verksemdList]
  );

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
