import useEventListener from '../../../../hooks/useEventListener';
import { TableProps } from '../../../types';

/**
 * A hook that listens to arrow key press events and navigates through the table pagination accordingly.
 * @param {Object} table - The TanStack table instance.
 * @returns {void}
 */

const usePaginationKeyPress = <T extends object>({ table }: TableProps<T>) => {
  /**
   * Handles the key down event and navigates the table.
   * @param {KeyboardEvent} e - The key down event.
   * @returns {void}
   */

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
