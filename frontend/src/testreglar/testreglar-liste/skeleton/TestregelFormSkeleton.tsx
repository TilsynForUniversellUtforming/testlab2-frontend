import TestlabFormFieldSkeleton from '@common/form/skeleton/TestlabFormFieldSkeleton';
import TestlabForm from '@common/form/TestlabForm';
import TestlabFormHeader from '@common/form/TestlabFormHeader';
import { Paragraph } from '@digdir/design-system-react';

import { Testregel } from '../../api/types';

export interface Props {
  heading: string;
  subHeading?: string;
}

const TestregelFormSkeleton = ({ heading, subHeading }: Props) => (
  <div className="testregel-form">
    <form className="testlab-form">
      {heading && (
        <TestlabFormHeader heading={heading} description={subHeading} />
      )}
      <Paragraph spacing size="small">
        Felter markert med stjerne er obligatoriske
      </Paragraph>
      <TestlabFormFieldSkeleton<Testregel>
        label="Namn"
        name="kravTilSamsvar"
        required
      />
      <TestlabFormFieldSkeleton<Testregel>
        label="Testregel test-id (unik)"
        name="testregelNoekkel"
        required
      />
      <TestlabFormFieldSkeleton<Testregel> label="Krav" name="krav" required />
      <div className="loeysing-form__submit">
        <TestlabForm.FormButtons loading />
      </div>
    </form>
  </div>
);

export default TestregelFormSkeleton;
