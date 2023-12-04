import { TestingStep } from '../types';

interface Props {
  steps: TestingStep[];
}

const TestForm = ({ steps }: Props) => {
  /* TODO:
    1. Hent testregel
    2. Parse testregel
    3. Lag zod-skjema med Record
    4. Bruk testlab-form komponentene
   */

  console.log(steps);
};

export default TestForm;
