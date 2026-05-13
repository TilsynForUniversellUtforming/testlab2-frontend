import { useMemo, useState } from 'react';
import { getInitialPageType, getPageTypeList } from '@test/util/testregelUtils';
import { PageType } from '@test/types';
import { Sideutval, SideutvalType } from '../../kontroll/sideutval/types';

interface UsePageTypeProps {
  sideutvalForLoeysing: Sideutval[];
  sideutvalTypeList: SideutvalType[];
  onSideutvalNotFound: () => void;
  onSideutvalChanged: (sideId: number) => void;
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
      onSideutvalChanged(next.sideId);
    } else {
      onSideutvalNotFound();
    }
  };

  return { pageTypeList, pageType, setPageType, sideId, onChangeSideutval };
};

