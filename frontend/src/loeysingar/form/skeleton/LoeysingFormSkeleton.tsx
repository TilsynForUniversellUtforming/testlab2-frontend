import TestlabFormFieldSkeleton from '@common/form/skeleton/TestlabFormFieldSkeleton';
import TestlabForm from '@common/form/TestlabForm';
import TestlabFormHeader from '@common/form/TestlabFormHeader';
import { Paragraph } from '@digdir/designsystemet-react';
import { LoeysingInit } from '@loeysingar/api/types';

export interface Props {
  heading: string;
  subHeading?: string;
}

const LoeysingFormSkeleton = ({ heading, subHeading }: Props) => (
  <div className="loeysing-form">
    <form className="testlab-form">
      {heading && (
        <TestlabFormHeader heading={heading} description={subHeading} />
      )}
      <div className="loeysing-form__input">
        <Paragraph spacing size="small">
          Felter markert med stjerne er obligatoriske
        </Paragraph>
        <TestlabFormFieldSkeleton<LoeysingInit>
          label="Namn"
          name="namn"
          required
        />
      </div>
      <div className="loeysing-form__input">
        <TestlabFormFieldSkeleton<LoeysingInit>
          label="Url"
          name="url"
          required
        />
      </div>
      <div className="loeysing-form__input">
        <TestlabFormFieldSkeleton<LoeysingInit>
          label="Organisasjonsnummer"
          name="organisasjonsnummer"
          required
        />
      </div>
      <div className="loeysing-form__submit">
        <TestlabForm.FormButtons loading />
      </div>
    </form>
  </div>
);

export default LoeysingFormSkeleton;
