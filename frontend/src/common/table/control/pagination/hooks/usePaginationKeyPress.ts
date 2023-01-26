import useEventListener from '../../../../hooks/useEventListener';
import { TableProps } from '../../../types';

const usePaginationKeyPress = ({ table }: TableProps) => {
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && table.getCanPreviousPage()) {
      table.previousPage();
    } else if (e.key == 'ArrowRight' && table.getCanNextPage()) {
      table.nextPage();
    }
  };

  useEventListener('keydown', onKeyDown);
};

export default usePaginationKeyPress;
