import TestlabForm from '@common/form/TestlabForm';
import TestlabFormInput from '@common/form/TestlabFormInput';
import { isOrgnummer } from '@common/util/validationUtils';
import { zodResolver } from '@hookform/resolvers/zod';
import { VerksemdContext, VerksemdInit } from '@verksemder/api/types';
import { createVerksemd } from '@verksemder/api/verksemd-api';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useOutletContext } from 'react-router-dom';
import { z } from 'zod';

const VerksemdCreate = () => {
  const { setContextError, setVerksemdList }: VerksemdContext =
    useOutletContext();

  const onSubmit = useCallback((verksemdInit: VerksemdInit) => {
    const doCreateVerksemd = async () => {
      try {
        const updated = await createVerksemd(verksemdInit);
        setVerksemdList(updated);
      } catch (e) {
        setContextError(new Error('Kunne ikkje opprette verksemd'));
      }
    };
    doCreateVerksemd();
  }, []);

  const verksemdCreateValidationSchema = z.object({
    organisasjonsnummer: z
      .string()
      .min(1, 'Organisasjonsnummer er påkrevd')
      .refine(
        (value) => isOrgnummer(value),
        'Dette er ikkje eit gyldig organisasjonsnummer'
      ),
  });

  const formMethods = useForm<VerksemdInit>({
    defaultValues: {
      organisasjonsnummer: '',
    },
    resolver: zodResolver(verksemdCreateValidationSchema),
  });

  return (
    <div className="loeysing-form">
      <TestlabForm<VerksemdInit>
        heading={'Ny verksemd'}
        description={'Legg til ny verksemd'}
        onSubmit={onSubmit}
        formMethods={formMethods}
        hasRequiredFields
      >
        <div className="loeysing-form__input">
          <TestlabFormInput
            label="Organisasjonsnummer"
            name="organisasjonsnummer"
            required
          />
        </div>
        <div className="loeysing-form__submit">
          <TestlabForm.FormButtons />
        </div>
      </TestlabForm>
    </div>
  );
};

export default VerksemdCreate;
