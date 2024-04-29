import { AlertProps } from '@common/alert/AlertTimed';
import TestlabForm, { TestlabFormProps } from '@common/form/TestlabForm';
import TestlabFormCheckbox from '@common/form/TestlabFormCheckbox';
import TestlabFormInput from '@common/form/TestlabFormInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { Verksemd, VerksemdUpdate } from '@verksemder/api/types';
import { verksemdValidationSchema } from '@verksemder/form/VerksemdValidationSchema';
import { useForm } from 'react-hook-form';

export interface Props
  extends Omit<TestlabFormProps<VerksemdUpdate>, 'children' | 'formMethods'> {
  verksemd?: Verksemd;
  alert?: AlertProps;
}

const VerksemdForm = ({ verksemd, heading, description, onSubmit }: Props) => {
  const formMethods = useForm<VerksemdUpdate>({
    defaultValues: {
      namn: verksemd?.namn ?? '',
      organisasjonsnummer: verksemd?.organisasjonsnummer ?? '',
      institusjonellSektorkode: verksemd?.institusjonellSektorkode.kode ?? '',
      institusjonellSektorkodeBeskrivelse:
        verksemd?.institusjonellSektorkode.beskrivelse ?? '',
      naeringskode: verksemd?.naeringskode.kode ?? '',
      naeringskodeBeskrivelse: verksemd?.naeringskode.beskrivelse ?? '',
      organisasjonsformKode: verksemd?.organisasjonsform.kode ?? '',
      organisasjonsformBeskrivelse:
        verksemd?.organisasjonsform.beskrivelse ?? '',
      fylkesnummer: verksemd?.fylke.fylkesnummer ?? '',
      fylke: verksemd?.fylke.fylke ?? '',
      kommune: verksemd?.kommune.kommune ?? '',
      kommunenummer: verksemd?.kommune.kommunenummer ?? '',
      postnummer: verksemd?.postadresse.postnummer ?? '',
      poststad: verksemd?.postadresse.poststad ?? '',
      talTilsette: verksemd?.talTilsette ?? 0,
      forvaltningsnivaa: verksemd?.forvaltningsnivaa ?? '',
      tenesteromraade: verksemd?.tenesteromraade ?? '',
      underAvviking: verksemd?.underAvviking ?? false,
    },
    resolver: zodResolver(verksemdValidationSchema),
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
          <TestlabFormInput label="Namn" name="namn" required />
        </div>
        <div className="loeysing-form__input">
          <TestlabFormInput
            label="Organisasjonsnummer"
            name="organisasjonsnummer"
            required
          />
        </div>
        <div className="loeysing-form__input">
          <TestlabFormInput
            label="Institusjonell sektorkode"
            name="institusjonellSektorkode"
            required
          />
        </div>
        <div className="loeysing-form__input">
          <TestlabFormInput
            label="Institusjonell sektorkode beskrivelse"
            name="institusjonellSektorkodeBeskrivelse"
            required
          />
        </div>
        <div className="loeysing-form__input">
          <TestlabFormInput label="Næringskode" name="naeringskode" required />
        </div>
        <div className="loeysing-form__input">
          <TestlabFormInput
            label="Naeringskode beskrivelse"
            name="naeringskodeBeskrivelse"
            required
          />
        </div>
        <div className="loeysing-form__input">
          <TestlabFormInput
            label="Organisasjonsform kode"
            name="organisasjonsformKode"
            required
          />
        </div>
        <div className="loeysing-form__input">
          <TestlabFormInput
            label="Organisasjonsform omtale"
            name="organisasjonsformOmtale"
            required
          />
        </div>
        <div className="loeysing-form__input">
          <TestlabFormInput label="Fylkesnummer" name="fylkesnummer" required />
        </div>
        <div className="loeysing-form__input">
          <TestlabFormInput label="Fylke" name="fylke" required />
        </div>
        <div className="loeysing-form__input">
          <TestlabFormInput label="Kommune" name="kommune" required />
        </div>
        <div className="loeysing-form__input">
          <TestlabFormInput
            label="Kommunenummer"
            name="kommunenummer"
            required
          />
        </div>
        <div className="loeysing-form__input">
          <TestlabFormInput label="Postnummer" name="postnummer" required />
        </div>
        <div className="loeysing-form__input">
          <TestlabFormInput label="Poststad" name="poststad" required />
        </div>
        <div className="loeysing-form__input">
          <TestlabFormInput
            label="Tal tilsette"
            name="talTilsette"
            required
            type={'number'}
          />
        </div>
        <div className="loeysing-form__input">
          <TestlabFormInput
            label="Forvaltningsnivaa"
            name="forvaltningsnivaa"
          />
        </div>
        <div className="loeysing-form__input">
          <TestlabFormInput label="Tenesteromraade" name="tenesteromraade" />
        </div>
        <div className="loeysing-form__input">
          <TestlabFormCheckbox
            label="Under avviking"
            checkboxLabel={'underAvviking'}
            name="underAvviking"
          />
        </div>
        <div className="loeysing-form__submit">
          <TestlabForm.FormButtons />
        </div>
      </TestlabForm>
      )
    </div>
  );
};

export default VerksemdForm;
