import TestlabForm from '@common/form/TestlabForm';
import TestlabFormInput from '@common/form/TestlabFormInput';
import { parseNumberInput } from '@common/util/stringutils';
import { zodResolver } from '@hookform/resolvers/zod';
import { CrawlParameters } from '@maaling/api/types';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import LagreOgNeste from '../lagre-og-neste/LagreOgNeste';

const crawlParametersValidationSchema = z
  .object({
    maxLenker: z
      .union([z.number(), z.string()])
      .transform((val) => parseNumberInput(val))
      .refine((value) => value >= 1 && value <= 10000, {
        message: 'Brutto-utval av nettsider må være mellom 1 og 10 000',
      }),
    talLenker: z
      .union([z.number(), z.string()])
      .transform((val) => parseNumberInput(val))
      .refine((value) => value >= 1 && value <= 2000, {
        message: 'Netto-utval av nettsider må være mellom 1 og 2000',
      }),
  })
  .refine(
    (data) =>
      parseNumberInput(data.maxLenker) >= parseNumberInput(data.talLenker),
    {
      message:
        'Brutto-utval av nettsider må vera større eller likt netto-utval',
      path: ['talLenker'],
    }
  );

interface Props {
  onSubmit: (crawlParameters: CrawlParameters) => void;
  sistLagret: Date;
  onClickNeste: () => void;
  onClickLagreKontroll: () => void;
  crawlParameters: CrawlParameters | undefined;
}

const AutomatiskSideutval = ({
  onSubmit,
  sistLagret,
  onClickNeste,
  onClickLagreKontroll,
  crawlParameters,
}: Props) => {
  const formMethods = useForm<CrawlParameters>({
    defaultValues: {
      maxLenker: crawlParameters?.maxLenker ?? 100,
      talLenker: crawlParameters?.talLenker ?? 30,
    },
    mode: 'onBlur',
    resolver: zodResolver(crawlParametersValidationSchema),
  });

  const {
    formState: { errors },
  } = formMethods;

  return (
    <TestlabForm<CrawlParameters>
      formMethods={formMethods}
      onSubmit={onSubmit}
      heading="Netto utval"
    >
      <TestlabFormInput
        label="Nettoutval"
        description="Antal sider du ønskjer å teste"
        name="talLenker"
        type="number"
        data-testid="automatisk-sideutval-netto"
      />
      <TestlabFormInput
        label="Bruttoutval"
        description="Antal sider du ønskjer å hente"
        name="maxLenker"
        type="number"
      />
      <LagreOgNeste
        sistLagret={sistLagret}
        onClickNeste={onClickNeste}
        onClickLagreKontroll={onClickLagreKontroll}
        testStarta={false}
        feilet={Object.keys(errors).length > 0}
        submitOnSave
      />
    </TestlabForm>
  );
};

export default AutomatiskSideutval;
