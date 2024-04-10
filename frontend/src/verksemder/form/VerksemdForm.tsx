import { AlertProps } from '@common/alert/AlertTimed';
import TestlabFormFieldSkeleton from '@common/form/skeleton/TestlabFormFieldSkeleton';
import TestlabForm, { TestlabFormProps } from '@common/form/TestlabForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { loeysingValidationSchema } from '@loeysingar/form/loeysingValidationSchema';
import { Verksemd, VerksemdUpdate } from '@verksemder/api/types';
import { useForm } from 'react-hook-form';

export interface Props
  extends Omit<TestlabFormProps<VerksemdUpdate>, 'children' | 'formMethods'> {
  verksemd?: Verksemd;
  alert?: AlertProps;
}

const VerksemdForm = ({ verksemd, heading, description, onSubmit }: Props) => {
  console.log('VerksemdForm ' + JSON.stringify(verksemd));

  const formMethods = useForm<VerksemdUpdate>({
    defaultValues: {
      namn: verksemd?.namn ?? '',
      organisasjonsnummer: verksemd?.organisasjonsnummer ?? '',
      institusjonellSektorkode: verksemd?.institusjonellSektorkode ?? '',
      institusjonellSektorkodeBeskrivelse:
        verksemd?.institusjonellSektorkodeBeskrivelse ?? '',
      naeringskode: verksemd?.naeringskode ?? '',
      naeringskodeBeskrivelse: verksemd?.naeringskodeBeskrivelse ?? '',
      organisasjonsformKode: verksemd?.organisasjonsformKode ?? '',
      organisasjonsformOmtale: verksemd?.organisasjonsformOmtale ?? '',
      fylkesnummer: verksemd?.fylkesnummer ?? '',
      fylke: verksemd?.fylke ?? '',
      kommune: verksemd?.kommune ?? '',
      kommunenummer: verksemd?.kommunenummer ?? '',
      postnummer: verksemd?.postnummer ?? '',
      poststad: verksemd?.poststad ?? '',
      talTilsette: verksemd?.talTilsette ?? 0,
      forvaltningsnivaa: verksemd?.forvaltningsnivaa ?? '',
      tenesteromraade: verksemd?.tenesteromraade ?? '',
      underAvviking: verksemd?.underAvviking ?? false,
    },
    resolver: zodResolver(loeysingValidationSchema),
  });

  return (
    <div className="loeysing-form">
      <TestlabForm<VerksemdUpdate>
        heading={heading}
        description={description}
        onSubmit={onSubmit}
        formMethods={formMethods}
        hasRequiredFields
      >
        <div className="loeysing-form__input">
          <TestlabFormFieldSkeleton<VerksemdUpdate>
            label="Namn"
            name="namn"
            required
          />
        </div>
        <div className="loeysing-form__input">
          <TestlabFormFieldSkeleton<VerksemdUpdate>
            label="Organisasjonsnummer"
            name="organisasjonsnummer"
            required
          />
        </div>
        <div className="loeysing-form__input">
          <TestlabFormFieldSkeleton<VerksemdUpdate>
            label="Institusjonell sektorkode"
            name="institusjonellSektorkode"
            required
          />
        </div>
        <div className="loeysing-form__input">
          <TestlabFormFieldSkeleton<VerksemdUpdate>
            label="Institusjonell sektorkode beskrivelse"
            name="institusjonellSektorkodeBeskrivelse"
            required
          />
        </div>
        <div className="loeysing-form__input">
          <TestlabFormFieldSkeleton<VerksemdUpdate>
            label="Næringskode"
            name="naeringskode"
            required
          />
        </div>
        <div className="loeysing-form__input">
          <TestlabFormFieldSkeleton<VerksemdUpdate>
            label="Naeringskode beskrivelse"
            name="naeringskodeBeskrivelse"
            required
          />
        </div>
        <div className="loeysing-form__input">
          <TestlabFormFieldSkeleton<VerksemdUpdate>
            label="Organisasjonsform kode"
            name="organisasjonsformKode"
            required
          />
        </div>
        <div className="loeysing-form__input">
          <TestlabFormFieldSkeleton<VerksemdUpdate>
            label="Organisasjonsform omtale"
            name="organisasjonsformOmtale"
            required
          />
        </div>
        <div className="loeysing-form__input">
          <TestlabFormFieldSkeleton<VerksemdUpdate>
            label="Fylkesnummer"
            name="fylkesnummer"
            required
          />
        </div>
        <div className="loeysing-form__input">
          <TestlabFormFieldSkeleton<VerksemdUpdate>
            label="Fylke"
            name="fylke"
            required
          />
        </div>
        <div className="loeysing-form__input">
          <TestlabFormFieldSkeleton<VerksemdUpdate>
            label="Kommune"
            name="kommune"
            required
          />
        </div>
        <div className="loeysing-form__input">
          <TestlabFormFieldSkeleton<VerksemdUpdate>
            label="Kommunenummer"
            name="kommunenummer"
            required
          />
        </div>
        <div className="loeysing-form__input">
          <TestlabFormFieldSkeleton<VerksemdUpdate>
            label="Postnummer"
            name="postnummer"
            required
          />
        </div>
        <div className="loeysing-form__input">
          <TestlabFormFieldSkeleton<VerksemdUpdate>
            label="Poststad"
            name="poststad"
            required
          />
        </div>
        <div className="loeysing-form__input">
          <TestlabFormFieldSkeleton<VerksemdUpdate>
            label="Tal tilsette"
            name="talTilsette"
            required
          />
        </div>
        <div className="loeysing-form__input">
          <TestlabFormFieldSkeleton<VerksemdUpdate>
            label="Forvaltningsnivaa"
            name="forvaltningsnivaa"
            required
          />
        </div>
        <div className="loeysing-form__input">
          <TestlabFormFieldSkeleton<VerksemdUpdate>
            label="Tenesteromraade"
            name="tenesteromraade"
            required
          />
        </div>
        <div className="loeysing-form__input">
          <TestlabFormFieldSkeleton<VerksemdUpdate>
            label="Under avviking"
            name="underAvviking"
            required
          />
        </div>
        <div className="loeysing-form__submit">
          <TestlabForm.FormButtons loading />
        </div>
      </TestlabForm>
      )
    </div>
  );
};

export default VerksemdForm;
