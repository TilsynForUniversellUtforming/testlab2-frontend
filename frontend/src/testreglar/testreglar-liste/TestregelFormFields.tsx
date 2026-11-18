import TestlabFormSelect from '@common/form/TestlabFormSelect';
import { OptionType, ButtonVariant } from '@common/types';
import React from 'react';
import styles from '../testreglar.module.scss';

import { TestregelModus } from '../api/types';
import { TestregelFormInput } from './testreglarValidationSchema';
import TestlabFormInput from '@common/form/TestlabFormInput';
import TestlabFormTextArea from '@common/form/TestlabFormTextArea';
import { createOptionsFromLiteral } from '@common/util/stringutils';
import {
  Button,
  Checkbox,
  Details,
  Heading,
} from '@digdir/designsystemet-react';
import { TrashFillIcon } from '@navikt/aksel-icons';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { ElementResultat } from '@test/api/types';

interface SelectProps {
  options: OptionType[];
}

interface TextAreaTestregelSchemaProps {
  testregelType: TestregelModus;
}

interface SelectModusProps extends SelectProps {
  disabled: boolean;
}

export const ModusSelect = ({ options, disabled }: SelectModusProps) => (
  <TestlabFormSelect<TestregelFormInput>
    radio
    name="modus"
    options={options}
    label={`Type testregel${disabled ? ' (kan ikkje endrast)' : ''}`}
    size="sm"
    disabled={disabled}
    multiline={true}
    required
  />
);

export const KravSelect = ({ options }: SelectProps) => (
  <TestlabFormSelect<TestregelFormInput>
    label="Krav"
    options={options}
    name="kravId"
    required
  />
);

export const LangSelect = ({ options }: SelectProps) => (
  <TestlabFormSelect<TestregelFormInput>
    options={options}
    label="Språk"
    name="spraak"
    required
  />
);

export const TestregelStatusSelect = ({ options }: SelectProps) => (
  <TestlabFormSelect<TestregelFormInput>
    options={options}
    label="Status"
    name="status"
    defaultValue={'publisert'}
    required
  />
);

export const TestregelTypeSelect = ({ options }: SelectProps) => (
  <TestlabFormSelect<TestregelFormInput>
    options={options}
    label="Type"
    name="type"
    defaultValue={'nett'}
    required
  />
);

export const InnhaldstypeSelect = ({ options }: SelectProps) => (
  <TestlabFormSelect<TestregelFormInput>
    options={options}
    label="Innhaldstype"
    name="innhaldstypeTesting"
  />
);

export const TemaSelect = ({ options }: SelectProps) => (
  <TestlabFormSelect<TestregelFormInput>
    options={options}
    label="Tema"
    name="tema"
  />
);

export const TestobjektSelect = ({ options }: SelectProps) => (
  <TestlabFormSelect<TestregelFormInput>
    options={options}
    label="Testobjekt"
    name="testobjekt"
  />
);

export const InputVersion = () => (
  <TestlabFormInput label="Versjon" name="versjon" type="number" required />
);

export const TestregelSchemaTextArea = ({
  testregelType,
}: TextAreaTestregelSchemaProps) => (
  <TestlabFormTextArea
    label={
      testregelType === 'manuell' ? 'WCAG testregel' : 'QualWeb regel-id (unik)'
    }
    description={
      testregelType === 'manuell'
        ? 'Testregel må være i gyldig JSON-format'
        : ''
    }
    name="testregelSchema"
  />
);

export const TestregelIdInput = () => (
  <TestlabFormInput label="Testregel test-id" name="testregelId" required />
);

export const NameTextArea = () => (
  <TestlabFormTextArea label="Namn" name="namn" required />
);

export const KravTilSamsvarTextArea = () => (
  <TestlabFormTextArea label="Krav til samsvar" name="kravTilSamsvar" />
);

const BrowserRichTextEditor = React.lazy(
  () =>
    import('./TestregelRichTextEditor').then((module) => ({
      default: module.default,
    }))
);

const ServerRichTextEditor = ({
  heading,
  className,
}: {
  heading: string;
  className?: string;
}) => (
  <>
    <Heading level={3} data-size="xs" className={className}>
      {heading}
    </Heading>
    <div className={styles.testregelFormTextareaHeading} />
  </>
);

const RichTextEditor =
  typeof window === 'undefined' ? ServerRichTextEditor : BrowserRichTextEditor;

export const InstruksjonTextArea = () => (
  <React.Suspense fallback={<ServerRichTextEditor heading="Testbeskrivelse" />}>
    <RichTextEditor heading="Testbeskrivelse" name="definition.description" />
  </React.Suspense>
);

export const HelptextTextArea = () => (
  <React.Suspense
    fallback={
      <ServerRichTextEditor
        heading="Helpetekst"
        className={styles.testregelFormTextareaHeading}
      />
    }
  >
    <RichTextEditor
      heading="Helpetekst"
      name="definition.helptext"
      className={styles.testregelFormTextareaHeading}
    />
  </React.Suspense>
);

const testresultatUtfallOptions = createOptionsFromLiteral<ElementResultat>([
  'samsvar',
  'brot',
  'ikkjeForekomst',
  'ikkjeTesta',
  'advarsel'
]);

export const UtfallFieldArray = () => {
  const { control, setValue } = useFormContext<any>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'definition.utfall' as any,
  });
  const utfallValues = useWatch({ control, name: 'definition.utfall' as any });
  const AnyTestlabFormTextArea = TestlabFormTextArea as any;
  const AnyTestlabFormSelect = TestlabFormSelect as any;

  const addUtfall = () => {
    append({
      beskrivelse: '',
      testresultat: 'samsvar',
      default: fields.length === 0,
    });
  };

  const onDefaultChange = (targetIndex: number, checked: boolean) => {
    if (!checked) {
      setValue(`definition.utfall.${targetIndex}.default` as any, false, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      return;
    }

    fields.forEach((_, index) => {
      setValue(`definition.utfall.${index}.default` as any, index === targetIndex, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    });
  };

  return (
    <div className={styles.testregelFormUtfall}>
      <Heading level={3} data-size="xs">
        Utfall
      </Heading>
      {fields.map((field, index) => (
        <div key={field.id} className={styles.testregelFormUtfallRow}>
          <Details key={field.id} className={styles.testregelFormUtfallRow}>
            <Details.Summary>
              {(utfallValues as any)?.[index]?.beskrivelse}
            </Details.Summary>
            <Details.Content>
              <AnyTestlabFormTextArea
                label={`Beskrivelse utfall ${index + 1}`}
                name={`definition.utfall.${index}.beskrivelse`}
                required
              />
              <AnyTestlabFormSelect
                options={testresultatUtfallOptions}
                label="Testresultat"
                name={`definition.utfall.${index}.testresultat`}
                required
              />
              <Checkbox
                label="Bruk som standard"
                checked={Boolean((utfallValues as any)?.[index]?.default)}
                onChange={() =>
                  onDefaultChange(index, !((utfallValues as any)?.[index]?.default))
                }
              />
              <Button
                type="button"
                variant={ButtonVariant.Quiet}
                onClick={() => remove(index)}
              >
                <TrashFillIcon aria-hidden />
                Fjern utfall
              </Button>
            </Details.Content>
          </Details>
        </div>
      ))}
      <Button type="button" variant={ButtonVariant.Outline} onClick={addUtfall}>
        Legg til utfall
      </Button>
    </div>
  );
};
