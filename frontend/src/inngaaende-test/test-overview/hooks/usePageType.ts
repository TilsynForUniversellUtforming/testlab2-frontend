import { useMemo, useState } from 'react';
import { PageType } from '@test/types';
import { Sideutval, SideutvalType } from '../../../kontroll/sideutval/types';
import { isNotDefined } from '@common/util/validationUtils';

interface UsePageTypeProps {
  sideutvalForLoeysing: Sideutval[];
  sideutvalTypeList: SideutvalType[];
  onSideutvalNotFound: () => void;
  onSideutvalChanged: (sideId: number|undefined) => void;
}

export const usePageType = ({
  sideutvalForLoeysing,
  sideutvalTypeList,
  onSideutvalNotFound,
  onSideutvalChanged,
}: UsePageTypeProps) => {
  const pageTypeList = useMemo(
    () => getPageTypeList(sideutvalForLoeysing, sideutvalTypeList),
    [sideutvalForLoeysing, sideutvalTypeList]
  );

  const [pageType, setPageType] = useState<PageType>(getInitialPageType(pageTypeList));
  const sideId = pageType.sideId;

  const onChangeSideutval = (sideutvalId: number) => {
    const next = pageTypeList.find((pt) => pt.sideId === sideutvalId);
    if (next) {
      setPageType(next);
      onSideutvalChanged(sideutvalId);
    } else {
      onSideutvalNotFound();
    }
  };

  return { pageTypeList, pageType, setPageType, sideId, onChangeSideutval };
};


function getPageTypeList(
  sideutvalList: Sideutval[],
  sideutvalType: SideutvalType[]
): PageType[] {
  return sideutvalList.reduce((acc: PageType[], su) => {
    let label: string;
    if (su.egendefinertType && su.egendefinertType.length > 0) {
      label = `Egendefinert: ${su.egendefinertType}`;
    } else {
      const type =
        sideutvalType.find((sut) => sut.id === su.typeId)?.type ?? '';
      const typeCount = acc.filter((item) =>
        item.pageType.startsWith(type)
      ).length;
      label = typeCount > 0 ? `${type} ${typeCount + 1}` : type;
    }
    acc.push({ sideId: su.id, pageType: label, url: su.url });
    return acc;
  }, []);
}

function getInitialPageType (pageTypeList: PageType[]): PageType  {
  const first = pageTypeList[0];
  if (isNotDefined(first))
    throw new Error('Det finns ikkje sideutval for test');
  return (
    pageTypeList.find((su) => su.pageType.toLowerCase() === 'forside') ?? first
  );
};
