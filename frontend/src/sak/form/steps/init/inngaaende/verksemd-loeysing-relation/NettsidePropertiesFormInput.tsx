import TestlabFormInput from '@common/form/TestlabFormInput';
import { Heading } from '@digdir/design-system-react';
import { SakFormState } from '@sak/types';
import { Path } from 'react-hook-form';

interface Props {
  heading: string;
  nameUrl: Path<SakFormState>;
  nameDescription: Path<SakFormState>;
}

const NettsidePropertiesFormInput = ({
  heading,
  nameUrl,
  nameDescription,
}: Props) => (
  <div className="sak-loeysing__nettsted-props-entry">
    <Heading size="xsmall" level={6}>
      {heading}
    </Heading>
    <TestlabFormInput<SakFormState> label="Url til side" name={nameUrl} />
    <TestlabFormInput<SakFormState>
      label="Beskrivelse"
      name={nameDescription}
    />
  </div>
);

export default NettsidePropertiesFormInput;
