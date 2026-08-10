import TestlabFormSelect from '@common/form/TestlabFormSelect';
import { OptionType, ButtonVariant } from '@common/types';
import React, { useCallback, useEffect, useState } from 'react';

import { TestregelInit, TestregelModus, TestresultatUtfall } from '../api/types';
import TestlabFormInput from '@common/form/TestlabFormInput';
import TestlabFormTextArea from '@common/form/TestlabFormTextArea';
import { createOptionsFromLiteral } from '@common/util/stringutils';
import { Button, Checkbox, Heading } from '@digdir/designsystemet-react';
import { TrashFillIcon } from '@navikt/aksel-icons';
import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import 'tinymce/tinymce';
// DOM model
import 'tinymce/models/dom/model';
// Theme
import 'tinymce/themes/silver';
// Toolbar icons
import 'tinymce/icons/default';
// Editor styles
import 'tinymce/skins/ui/oxide/skin';
// Content styles, including inline UI like fake cursors
import 'tinymce/skins/content/default/content';
import 'tinymce/skins/ui/oxide/content';

// Import plugins
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
import 'tinymce/plugins/media';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/help';
// Include resources that a plugin lazy-loads at the run-time
import 'tinymce/plugins/help/js/i18n/keynav/en';
import 'tinymce/plugins/image';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/table';
import 'tinymce/plugins/wordcount';
import { Editor } from '@tinymce/tinymce-react';

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
  <TestlabFormSelect<TestregelInit>
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
  <TestlabFormSelect<TestregelInit>
    label="Krav"
    options={options}
    name="kravId"
    required
  />
);

export const LangSelect = ({ options }: SelectProps) => (
  <TestlabFormSelect<TestregelInit>
    options={options}
    label="Språk"
    name="spraak"
    required
  />
);

export const TestregelStatusSelect = ({ options }: SelectProps) => (
  <TestlabFormSelect<TestregelInit>
    options={options}
    label="Status"
    name="status"
    defaultValue={'publisert'}
    required
  />
);

export const TestregelTypeSelect = ({ options }: SelectProps) => (
  <TestlabFormSelect<TestregelInit>
    options={options}
    label="Type"
    name="type"
    defaultValue={'nett'}
    required
  />
);

export const InnhaldstypeSelect = ({ options }: SelectProps) => (
  <TestlabFormSelect<TestregelInit>
    options={options}
    label="Innhaldstype"
    name="innhaldstypeTesting"
  />
);

export const TemaSelect = ({ options }: SelectProps) => (
  <TestlabFormSelect<TestregelInit>
    options={options}
    label="Tema"
    name="tema"
  />
);

export const TestobjektSelect = ({ options }: SelectProps) => (
  <TestlabFormSelect<TestregelInit>
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

  export const InstruksjonTextArea = () => {
    const { control, formState } = useFormContext();

    return (
      <Controller
        name="definition.description"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Editor value={value} onEditorChange={onChange} licenseKey="gpl" />
        )}
      />
    );
    // <TestlabFormTextArea label="Instruksjon" name={'definition.description'} />
  };

const testresultatUtfallOptions = createOptionsFromLiteral<TestresultatUtfall>([
  'samsvar',
  'brot',
  'ikkje-forekomst',
  'ikkje-testbar',
]);

export const UtfallFieldArray = () => {
  const { control, setValue } = useFormContext<TestregelInit>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'definition.utfall',
  });
  const utfallValues = useWatch({ control, name: 'definition.utfall' });

  const addUtfall = () => {
    append({
      beskrivelse: '',
      testresultat: 'samsvar',
      default: fields.length === 0,
    });
  };

  const onDefaultChange = (targetIndex: number, checked: boolean) => {
    if (!checked) {
      setValue(`definition.utfall.${targetIndex}.default`, false, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      return;
    }

    fields.forEach((_, index) => {
      setValue(`definition.utfall.${index}.default`, index === targetIndex, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    });
  };

  return (
    <div className="testregel-form-utfall">
      <Heading level={3} data-size="xs">
        Utfall
      </Heading>
      {fields.map((field, index) => (
        <div key={field.id} className="testregel-form-utfall__row">
          <TestlabFormTextArea
            label={`Beskrivelse utfall ${index + 1}`}
            name={`definition.utfall.${index}.beskrivelse` as const}
            required
          />
          <TestlabFormSelect<TestregelInit>
            options={testresultatUtfallOptions}
            label="Testresultat"
            name={`definition.utfall.${index}.testresultat` as const}
            required
          />
          <Checkbox
            label="Bruk som standard"
            checked={Boolean(utfallValues?.[index]?.default)}
            onChange={() =>
              onDefaultChange(index, !utfallValues?.[index]?.default)
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
        </div>
      ))}
      <Button type="button" variant={ButtonVariant.Outline} onClick={addUtfall}>
        Legg til utfall
      </Button>
    </div>
  );
};
