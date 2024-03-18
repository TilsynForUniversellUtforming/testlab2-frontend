import TestlabFormFieldSkeleton from '@common/form/skeleton/TestlabFormFieldSkeleton';
import TestlabForm from '@common/form/TestlabForm';
import TestlabFormHeader from '@common/form/TestlabFormHeader';
import { Paragraph } from '@digdir/designsystemet-react';

import { Regelsett } from '../../api/types';

export interface Props {
  heading: string;
  description?: string;
}

const RegelsettFormSkeleton = ({ heading, description }: Props) => (
  <div className="testregel-form">
    <form className="testlab-form">
      {heading && (
        <TestlabFormHeader heading={heading} description={description} />
      )}
      <Paragraph spacing size="small">
        Felter markert med stjerne er obligatoriske
      </Paragraph>
      <TestlabFormFieldSkeleton<Regelsett>
        label="Namn"
        name="namn"
        description="Namn på regelsettet"
        required
      />
      <TestlabFormFieldSkeleton<Regelsett>
        label="Type"
        name="modus"
        width={35}
        required
      />
      <TestlabFormFieldSkeleton<Regelsett>
        label="Standard"
        description="Bestemmer om regelsettet skal komma opp som det standard regelsettet ein bruker i samband med å opprett saker"
        name="standard"
        width={35}
      />
      <div className="loeysing-form__submit">
        <TestlabForm.FormButtons loading />
      </div>
    </form>
  </div>
);

export default RegelsettFormSkeleton;
