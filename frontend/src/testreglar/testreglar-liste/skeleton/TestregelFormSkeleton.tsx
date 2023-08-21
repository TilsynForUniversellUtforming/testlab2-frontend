import TestlabFormFieldSkeleton from '@common/form/skeleton/TestlabFormFieldSkeleton';
import TestlabFormHeader from '@common/form/TestlabFormHeader';

import { Testregel } from '../../api/types';

export interface Props {
  heading: string;
  subHeading?: string;
}

const TestregelFormSkeleton = ({ heading, subHeading }: Props) => (
  <div className="testregel-form">
    <form className="testlab-form">
      {heading && (
        <TestlabFormHeader
          heading={heading}
          subHeading={subHeading}
          hasRequiredFields
        />
      )}
      <TestlabFormFieldSkeleton<Testregel>
        label="Namn"
        name="kravTilSamsvar"
        required
        width={210}
      />
      <TestlabFormFieldSkeleton<Testregel>
        label="Testregel test-id (unik)"
        name="testregelNoekkel"
        required
        width={210}
      />
      <TestlabFormFieldSkeleton<Testregel>
        label="Krav"
        name="krav"
        required
        width={210}
      />
    </form>
  </div>
);

export default TestregelFormSkeleton;
