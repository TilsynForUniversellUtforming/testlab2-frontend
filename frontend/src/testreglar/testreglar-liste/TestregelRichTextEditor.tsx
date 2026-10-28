import React from 'react';
import { Heading } from '@digdir/designsystemet-react';

import { TrashFillIcon } from '@navikt/aksel-icons';
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form';
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
import { ElementResultat } from '@test/api/types';

type TestregelRichTextEditorProps = {
  heading: string;
  name: string;
  className?: string;
};

export const TestregelRichTextEditor = ({
  heading,
  name,
  className,
}: TestregelRichTextEditorProps) => {
  const { control } = useFormContext<any>();

  return (
    <>
      <Heading level={3} data-size="xs" className={className}>
        {heading}
      </Heading>
      <Controller
        name={name as any}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Editor
            value={(value ?? '') as string}
            onEditorChange={onChange as (content: string) => void}
            licenseKey="gpl"
            plugins={['lists', 'advlist', 'code', 'table']}
            toolbar={[
              'undo redo | bold italic underline | fontfamily fontsize',
              'alignleft aligncenter alignright alignjustify | outdent indent | bullist numlist',
            ]}
          />
        )}
      />
    </>
  );
};

export default TestregelRichTextEditor;



