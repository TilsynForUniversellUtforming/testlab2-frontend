import { CreateTestResultat, ResultatStatus, Svar } from '@test/api/types';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TestformAutomatiskFormValues,
  testformAutomatiskValidationSchema,
} from '@test/testregel-form/testform-automatisk/testformAutomatiskValidationSchema';
import { TestregelUtfall } from '@testreglar/api/types';
import { useMemo } from 'react';
import { capitalize } from '@common/util/stringutils';

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
      elementOmtale: eksisterandeResultat.element?.elementOmtale,
      elementOmtaleHtml: eksisterandeResultat.element?.elementOmtaleHtml,
      elementResultat: eksisterandeResultat.element?.elementResultat,
      elementUtfall: eksisterandeResultat.element?.elementUtfall,
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
