import { OptionType } from '@common/types';
import { isNotDefined } from '@common/util/validationUtils';
import { ResultatManuellKontroll } from '@test/api/types';
import { ContextKontroll, PageType } from '@test/types';
import { filterTestregelByInnhaldstype } from '@test/util/testregelUtils';
import { InnhaldstypeTesting } from '@testreglar/api/types';

import { Sideutval, SideutvalType } from '../../kontroll/sideutval/types';

export const progressionForLoeysingNettsideKontroll = (
  kontroll: ContextKontroll,
  testResults: ResultatManuellKontroll[],
  sideutvalId: number,
  innhaldstype: InnhaldstypeTesting,
  loeysingId: number
): number => {
  const testregelIdList = filterTestregelByInnhaldstype(
    kontroll.testregelList,
    innhaldstype
  ).map((tr) => tr.id);

  const finishedTestIdentifierArray = testResults
    .filter(
      (tr) =>
        testregelIdList.includes(tr.testregelId) &&
        tr.loeysingId === loeysingId &&
        tr.sideutvalId === sideutvalId &&
        tr.status === 'Ferdig'
    )
    .map((tr) => `${tr.testregelId}-${tr.loeysingId}-${tr.sideutvalId}`);

  const numFinishedTestResults = new Set(finishedTestIdentifierArray).size;

  const numContentTestregel = testregelIdList.length;

  if (numContentTestregel > 0) {
    return Math.round((numFinishedTestResults / numContentTestregel) * 100);
  }

  // No testregel with current innhaldstype
  return 0;
};
export const getSideutvalOptionList = (
  kontroll: ContextKontroll,
  sideutvalType: SideutvalType[],
  loeysingId: number | undefined
): OptionType[] => {
  return kontroll.sideutvalList
    .filter((l) => loeysingId === l.loeysingId)
    .reduce((acc: OptionType[], su) => {
      let label: string;
      if (su.egendefinertType && su.egendefinertType.length > 0) {
        label = `Egendefinert: ${su.egendefinertType}`;
      } else {
        const type =
          sideutvalType.find((sut) => sut.id === su.typeId)?.type || '';
        const existingType = acc.find((item) => item.label.startsWith(type));
        if (existingType) {
          const typeCount =
            acc.filter((item) => item.label.startsWith(type)).length + 1;
          label = `${type} ${typeCount}`;
        } else {
          label = type;
        }
      }

      acc.push({
        label: label,
        value: String(su.id),
      });
      return acc;
    }, []);
};

export const getInitialPageTypeKontroll = (
  sideutval: Sideutval[],
  sideutvalTypeList: SideutvalType[]
): PageType => {
  const firstInSideutval = sideutval[0];
  if (isNotDefined(firstInSideutval)) {
    throw Error('Det finns ikkje sideutval for test');
  }

  const forside = sideutvalTypeList.find(
    (su) => su.type.toLowerCase() === 'forside'
  );

  if (isNotDefined(forside)) {
    throw Error('Det finns ikkje påkrevd forside for test');
  }

  const property = sideutval.find((su) => su.typeId === forside.id);

  if (isNotDefined(property)) {
    throw Error('Det finns ikkje påkrevd forside for test');
  }

  return { sideId: property.id, pageType: forside.type, url: property.url };
};

export const toSideutvalTestside = (
  sideutval: Sideutval[],
  sideutvalTypeList: SideutvalType[],
  sideutvalId: number
): PageType => {
  const firstInSideutval = sideutval[0];
  if (isNotDefined(firstInSideutval)) {
    throw Error('Det finns ikkje sideutval for test');
  }

  const property =
    sideutval.find((np) => np.id === sideutvalId) || firstInSideutval;

  const sideutvalType = property?.egendefinertType
    ? property.egendefinertType
    : sideutvalTypeList.find((su) => su.id === property.typeId)?.type;

  if (isNotDefined(sideutvalType)) {
    throw Error('Det finns ikkje påkrevd forside for test');
  }

  return {
    sideId: property.id,
    pageType: sideutvalType,
    url: property.url,
  };
};
