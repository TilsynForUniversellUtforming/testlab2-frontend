import { CreateTestResultat, ResultatStatus, Svar } from '@test/api/types';
import { useForm, UseFormReturn } from 'react-hook-form';
import { testformForenklaValidationSchema } from '@test/testregel-form/testform-forenkla/testformForenklaValidationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { TestregelUtfall } from '@testreglar/api/types';
import { useMemo } from 'react';
import { capitalize } from '@common/util/stringutils';
import {
  TestformAutomatiskFormValues,
  testformAutomatiskValidationSchema,
} from '@test/testregel-form/testform-automatisk/testformAutomatiskValidationSchema';

export const useTestFormAutomatiskFormOptions = (
  eksisterandeResultat: {
    id: number;
    svar: Svar[];
    status: ResultatStatus;
    sistLagra: string;
  } & CreateTestResultat
): UseFormReturn<TestformAutomatiskFormValues> => {




  return useForm<TestformAutomatiskFormValues>({
    defaultValues: {
      id: eksisterandeResultat.id,
      testgrunnlagId: eksisterandeResultat.testgrunnlagId,
      loeysingId: eksisterandeResultat.loeysingId,
      testregelId: eksisterandeResultat.testregelId,
      sideutvalId: eksisterandeResultat.sideutvalId,
      status: eksisterandeResultat.status,
      sistLagra: eksisterandeResultat.sistLagra,
      kommentar: eksisterandeResultat.kommentar,
      elementOmtale: eksisterandeResultat.elementOmtale,
      elementOmtaleHtml: eksisterandeResultat.elementOmtaleHtml,
      elementResultat: eksisterandeResultat.elementResultat,
      elementUtfall: eksisterandeResultat.elementUtfall,
    },
    resolver: zodResolver(testformAutomatiskValidationSchema),
  });
};

export const useUtfallOption = (utfall: TestregelUtfall[]) => {
  return useMemo(
    () =>
      utfall.map((utfall, index) => ({
        elementLabel: (
          <>
            <strong>{capitalize(utfall.testresultat)}</strong>
            {': ' + utfall.beskrivelse}
          </>
        ),
        label: capitalize(utfall.testresultat) + ': ' + utfall.beskrivelse,
        value: index,
      })),
    [utfall]
  );
};
