import { CreateTestResultat, ResultatStatus, Svar } from '@test/api/types';
import { useForm, UseFormReturn } from 'react-hook-form';
import {
  TestformForenklaFormValues,
  customUtfallValue,
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
): UseFormReturn<TestformForenklaFormValues> => {
  const eksisterandeElementResultat =
    eksisterandeResultat.elementResultat ?? undefined;
  const eksisterandeElementUtfall =
    eksisterandeResultat.elementUtfall ?? undefined;

  const selectedUtfallIndex = utfall.findIndex(
    (u) =>
      u.testresultat === eksisterandeElementResultat &&
      u.beskrivelse === eksisterandeElementUtfall
  );

  const selectedUtfallIndexByResult = utfall.findIndex(
    (u) => u.testresultat === eksisterandeElementResultat
  );

  const defaultUtfallIndex = Math.max(
    utfall.findIndex((u) => u.default),
    0
  );

  const hasCustomUtfall =
    selectedUtfallIndex < 0 &&
    eksisterandeElementUtfall !== undefined &&
    eksisterandeElementResultat !== undefined;

  let valgtUtfallIndex: TestformForenklaFormValues['valgtUtfallIndex'] =
    defaultUtfallIndex;

  if (hasCustomUtfall) {
    valgtUtfallIndex = customUtfallValue;
  } else if (selectedUtfallIndex >= 0) {
    valgtUtfallIndex = selectedUtfallIndex;
  } else if (selectedUtfallIndexByResult >= 0) {
    valgtUtfallIndex = selectedUtfallIndexByResult;
  }

  return useForm<
    TestformForenklaFormValues,
    unknown,
    TestformForenklaFormValues
  >({
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
      valgtUtfallIndex,
      elementOmtale: eksisterandeResultat.elementOmtale,
      elementOmtaleHtml: eksisterandeResultat.elementOmtaleHtml,
      customUtfallTestresultat: hasCustomUtfall
        ? eksisterandeElementResultat
        : undefined,
      customUtfallBeskrivelse: hasCustomUtfall
        ? eksisterandeElementUtfall
        : undefined,
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
        value: utfall.id,
      })),
    [utfall]
  );
};