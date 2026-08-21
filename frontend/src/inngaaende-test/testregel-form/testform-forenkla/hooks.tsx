import { CreateTestResultat, ResultatStatus, Svar } from '@test/api/types';
import { useForm } from 'react-hook-form';
import {
  TestformForenklaFormValues,
  testformForenklaValidationSchema,
} from '@test/testregel-form/testform-forenkla/testformForenklaValidationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { TestregelUtfall } from '@testreglar/api/types';
import { useMemo } from 'react';
import { capitalize } from '@common/util/stringutils';

export const useTestFormForenklaFormOptions = (
  eksisterandeResultat: {
    id: number;
    svar: Svar[];
    status: ResultatStatus;
    sistLagra: string;
  } & CreateTestResultat,
  utfall: TestregelUtfall[]
) => {
  const selectedUtfallIndex = utfall.findIndex(
    (u) => u.testresultat === eksisterandeResultat.elementResultat
  );

  const defaultUtfallIndex = Math.max(
    utfall.findIndex((u) => u.default),
    0
  );

  return useForm<TestformForenklaFormValues>({
    defaultValues: {
      id: eksisterandeResultat.id,
      testgrunnlagId: eksisterandeResultat.testgrunnlagId,
      loeysingId: eksisterandeResultat.loeysingId,
      testregelId: eksisterandeResultat.testregelId,
      sideutvalId: eksisterandeResultat.sideutvalId,
      status: eksisterandeResultat.status,
      sistLagra: eksisterandeResultat.sistLagra,
      svar:
        eksisterandeResultat.svar.length > 0
          ? eksisterandeResultat.svar
          : undefined,
      kommentar: eksisterandeResultat.kommentar,
      valgtUtfallIndex:
        selectedUtfallIndex >= 0 ? selectedUtfallIndex : defaultUtfallIndex,
      elementOmtale: eksisterandeResultat.elementOmtale,
    },
    resolver: zodResolver(testformForenklaValidationSchema),
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