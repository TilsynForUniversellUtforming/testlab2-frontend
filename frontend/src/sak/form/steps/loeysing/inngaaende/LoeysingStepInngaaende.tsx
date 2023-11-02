import { Chip, Spinner } from '@digdir/design-system-react';
import { Loeysing } from '@loeysingar/api/types';
import { SakFormBaseProps, VerksemdLoeysingRelation } from '@sak/types';
import { getVerksemdLoesyingRelations_dummy } from '@verksemder/api/verksemd-api';
import { useEffect, useState } from 'react';

const LoeysingStepInngaaende = ({
  // formStepState,
  sakFormState, // onSubmit,
}: SakFormBaseProps) => {
  const [verksemdLoeysingRelation, setVerksemdLoeysingRelation] =
    useState<VerksemdLoeysingRelation>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const doGetVerksemdLoesyingRelations = async (verksemd?: Loeysing) => {
      setLoading(true);
      if (verksemd && verksemd.id !== verksemdLoeysingRelation?.verksemd?.id) {
        const relationship = await getVerksemdLoesyingRelations_dummy(verksemd);
        setVerksemdLoeysingRelation(relationship);
      }
    };

    doGetVerksemdLoesyingRelations(sakFormState.verksemd).finally(() =>
      setLoading(false)
    );
  }, [sakFormState, verksemdLoeysingRelation]);

  if (loading) {
    return <Spinner title="Laster forhald" />;
  }

  if (verksemdLoeysingRelation) {
    return (
      <>
        {verksemdLoeysingRelation?.loeysingList.map((loeysing) => (
          <Chip.Toggle key={loeysing.id}>{loeysing.namn}</Chip.Toggle>
        ))}
      </>
    );
  } else {
    return null;
    // return <VerksemdLoesyingRelationForm />;
  }
};

export default LoeysingStepInngaaende;
