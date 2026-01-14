import { Cell, flexRender} from '@tanstack/react-table';
import { Table } from '@digdir/designsystemet-react';
import React from 'react';
import { CellCheckboxId } from '@common/table/types';

function getCellContent<T>(cell: Cell<T, unknown>) {
  return flexRender(cell.column.columnDef.cell, cell.getContext());
}



function isCheckBox<T>(cell: Cell<T, unknown>) {
  return cell.id.includes(CellCheckboxId);
}

export const TestlabTableCell = <T extends object>(props: {
  cell: Cell<T, unknown>;
  onClickCallback?: () => void;
}) => {

  const isSelectable = typeof props.onClickCallback !== 'undefined';
  const cellContent = getCellContent(props.cell);

  if(isSelectable && !isCheckBox(props.cell)) {
    return (<Table.Cell onClick={() => props.onClickCallback!()
    }>
      {cellContent}
    </Table.Cell>)
  }

  return (<Table.Cell>
    {cellContent}
  </Table.Cell>)
};