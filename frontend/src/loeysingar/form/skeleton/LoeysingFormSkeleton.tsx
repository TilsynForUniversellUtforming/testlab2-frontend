import TestlabFormFieldSkeleton from '@common/form/skeleton/TestlabFormFieldSkeleton';
import TestlabFormHeader from '@common/form/TestlabFormHeader';
import { LoeysingInit } from '@loeysingar/api/types';

export interface Props {
  heading: string;
  subHeading?: string;
}

const LoeysingFormSkeleton = ({ heading, subHeading }: Props) => (
  <div className="loeysing-form">
    <form className="testlab-form">
      {heading && (
        <TestlabFormHeader
          heading={heading}
          subHeading={subHeading}
          hasRequiredFields
        />
      )}
      <div className="loeysing-form__input">
        <TestlabFormFieldSkeleton<LoeysingInit>
          label="Namn"
          name="namn"
          required
          width={210}
        />
      </div>
      <div className="loeysing-form__input">
        <TestlabFormFieldSkeleton<LoeysingInit>
          label="Url"
          name="url"
          required
          width={210}
        />
      </div>
      <div className="loeysing-form__input">
        <TestlabFormFieldSkeleton<LoeysingInit>
          label="Organisasjonsnummer"
          name="organisasjonsnummer"
          required
          width={210}
        />
      </div>
    </form>
  </div>
);

export default LoeysingFormSkeleton;
