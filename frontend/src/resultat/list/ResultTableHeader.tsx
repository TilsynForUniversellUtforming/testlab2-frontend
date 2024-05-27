import { Heading, Label, Search } from '@digdir/designsystemet-react';
import { Column } from '@tanstack/react-table';
import { ChangeEvent, useCallback, useState } from 'react';

interface Props<T extends object> {
  kontrollTypeColumn: Column<T, unknown>;
  dateColumn: Column<T, unknown>;
}
const ResultTableHeader = <T extends object>({
  kontrollTypeColumn,
  dateColumn,
}: Props<T>) => {
  const [searchValue, setSearchValue] = useState('');
  const [beforeDate, setBeforeDate] = useState<Date | undefined>();
  const [afterDate, setafterDate] = useState<Date | undefined>();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    filterColumn(e.target.value);
  };

  const onChangeBeforeDate = (e: ChangeEvent<HTMLInputElement>) => {
    setBeforeDate(new Date(e.target.value));
    filterBeforeDate(new Date(e.target.value));
  };

  const onChangeAfterDate = (e: ChangeEvent<HTMLInputElement>) => {
    setafterDate(new Date(e.target.value));
    filterAfterDate(new Date(e.target.value));
  };

  const filterColumn = useCallback(
    (searchValue: string) => {
      if (kontrollTypeColumn) {
        kontrollTypeColumn.setFilterValue(searchValue);
      }
    },
    [searchValue]
  );

  const filterBeforeDate = useCallback(
    (beforeDate: Date) => {
      if (dateColumn) {
        dateColumn.setFilterValue(() => [beforeDate.getTime(), afterDate]);
      }
    },
    [beforeDate, afterDate]
  );

  const filterAfterDate = useCallback(
    (afterDate: Date) => {
      if (dateColumn) {
        dateColumn.setFilterValue(() => [beforeDate, afterDate.getTime()]);
      }
    },
    [beforeDate, afterDate]
  );

  const onClear = () => {
    setSearchValue('');
  };

  return (
    <div className="resultat-header">
      <Heading size="medium" level={4} spacing>
        Filtrer visning
      </Heading>
      <div id="kontrollTypeFilter">
        <Label htmlFor="table-search">Søk i etter type kontroll</Label>
        <Search
          id="table-search"
          value={searchValue}
          onChange={onChange}
          onClear={onClear}
          size="medium"
          variant="simple"
        />
      </div>
      <div id="kontrollDateFilter">
        <div id="filterBefore">
          <Label htmlFor="beforeDate">Før dato</Label>
          <input type="date" id="beforeDate" onChange={onChangeBeforeDate} />
        </div>
        <div id="filterAfter">
          <Label htmlFor="afterDate">Etter dato</Label>
          <input type="date" id="afterDate" onChange={onChangeAfterDate} />
        </div>
      </div>
    </div>
  );
};

export default ResultTableHeader;
