import TestlabFormFieldSkeleton from '@common/form/skeleton/TestlabFormFieldSkeleton';
import TestlabForm from '@common/form/TestlabForm';
import TestlabFormHeader from '@common/form/TestlabFormHeader';
import { Paragraph } from '@digdir/designsystemet-react';

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
      <TestlabFormFieldSkeleton<Testregel> label="Namn" name="namn" required />
      <TestlabFormFieldSkeleton<Testregel>
        label="Testregel-id"
        name="testregelId"
        required
      />
      <TestlabFormFieldSkeleton<Testregel>
        label="QualWeb regel-id (unik)"
        name="testregelSchema"
        required
      />
      <TestlabFormFieldSkeleton<Testregel> label="Krav" name="krav" required />
      <TestlabFormFieldSkeleton<Testregel>
        label="Innhaldstype"
        name="innhaldstypeTesting"
      />
      <TestlabFormFieldSkeleton<Testregel> label="Tema" name="tema" />
      <TestlabFormFieldSkeleton<Testregel>
        label="Testobjekt"
        name="testobjekt"
      />
      <TestlabFormFieldSkeleton<Testregel> label="Språk" name="spraak" />
      <TestlabFormFieldSkeleton<Testregel> label="Status" name="status" />
      <TestlabFormFieldSkeleton<Testregel> label="Innhaldstype" name="type" />
      <TestlabFormFieldSkeleton<Testregel>
        label="Krav til samsvar"
        name="kravTilSamsvar"
      />
      <div className="loeysing-form__submit">
        <TestlabForm.FormButtons loading />
      </div>
    </form>
  </div>
);

export default TestregelFormSkeleton;
