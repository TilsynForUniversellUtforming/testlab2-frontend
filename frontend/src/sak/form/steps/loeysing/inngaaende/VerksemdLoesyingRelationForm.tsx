import TestlabForm from '@common/form/TestlabForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { loeysingValidationSchema } from '@loeysingar/form/loeysingValidationSchema';
import { VerksemdLoeysingRelation } from '@sak/types';
import { useForm } from 'react-hook-form';

interface Props {
  verksemdLoeysingRelation: VerksemdLoeysingRelation;
}

const VerksemdLoesyingRelationForm = ({ verksemdLoeysingRelation }: Props) => {
  // const [loeysingList, setLoeysingList] = useState<VerksemdLoeysingRelation>(
  //   verksemdLoeysingRelation
  // );

  const onSubmit = (verksemdLoeysingRelation: VerksemdLoeysingRelation) => {
    console.log(verksemdLoeysingRelation);
  };

  const formMethods = useForm<VerksemdLoeysingRelation>({
    defaultValues: {
      verksemd: verksemdLoeysingRelation?.verksemd,
      loeysingList: verksemdLoeysingRelation?.loeysingList,
    },
    resolver: zodResolver(loeysingValidationSchema),
  });

  return (
    <>
      <TestlabForm<VerksemdLoeysingRelation>
        heading="Utvalgte nettsteder"
        description="Det kom ingen utvalgte nettsteder med i søket.
Legg inn navn på virksomheter, underenheter eller digitale verktøy
som skal være en del av denne testen. Sideutvalg gjøres på et senere tidspunkt"
        onSubmit={onSubmit}
        formMethods={formMethods}
        hasRequiredFields
      >
        <div className="loeysing-form__input">
          <TestlabForm.FormInput label="Namn" name="namn" required />
        </div>
        <div className="loeysing-form__input">
          <TestlabForm.FormInput label="Url" name="url" required />
        </div>
        <div className="loeysing-form__input">
          <TestlabForm.FormInput
            label="Organisasjonsnummer"
            name="organisasjonsnummer"
            required
          />
        </div>
        <div className="loeysing-form__submit">
          <TestlabForm.FormButtons />
        </div>
      </TestlabForm>
    </>
  );
};

export default VerksemdLoesyingRelationForm;
