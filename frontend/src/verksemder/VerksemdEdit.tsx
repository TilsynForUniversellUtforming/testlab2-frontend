import useContentDocumentTitle from '@common/hooks/useContentDocumentTitle';
import {
  Verksemd,
  VerksemdContext,
  VerksemdUpdate,
} from '@verksemder/api/types';
import { updateVerksemd } from '@verksemder/api/verksemd-api';
import VerksemdForm from '@verksemder/form/VerksemdForm';
import { VERKSEMD_EDIT } from '@verksemder/VerksemdRoutes';
import React, { useCallback, useState } from 'react';
import { useLoaderData, useOutletContext, useParams } from 'react-router-dom';

const VerksemdEdit = () => {
  const {
    verksemdList,
    contextLoading,
    setVerksemdList,
    setContextError,
  }: VerksemdContext = useOutletContext();
  const { id } = useParams();
  const initVerksemd = useLoaderData() as Verksemd;
  const [verksemd] = useState(initVerksemd);
  const [, setLoading] = useState(contextLoading);

  useContentDocumentTitle(VERKSEMD_EDIT.navn, verksemd?.namn);

  const onSubmit = useCallback(
    (verksemdEdit: VerksemdUpdate) => {
      const doEditVerksemd = async () => {
        if (verksemdEdit && id) {
          setLoading(true);
          const verksemd: Verksemd = { ...verksemdEdit, id: Number(id) };
          try {
            const updated = await updateVerksemd(verksemd);
            setVerksemdList(updated);
          } catch (e) {
            setContextError(new Error('Kunne ikkje endre løysing'));
          } finally {
            setLoading(false);
          }
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
      onSubmit={onSubmit}
    />
  );
};

export default VerksemdEdit;
