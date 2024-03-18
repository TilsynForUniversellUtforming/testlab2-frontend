import { Label, Search } from '@digdir/designsystemet-react';
import { ChangeEvent, useEffect, useState } from 'react';

interface Props {
  showSearch: boolean;
  onChangeFilter: (search: string) => void;
  resetPagination: () => void;
}

const TableSearch = ({
  showSearch,
  onChangeFilter,
  resetPagination,
}: Props) => {
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChangeFilter(searchValue);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchValue]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    resetPagination();
  };

  const onClear = () => {
    setSearchValue('');
    onChangeFilter('');
  };

  if (!showSearch) {
    return null;
  }

  return (
    <div className="control-header__search">
      <Label htmlFor="table-search">Søk i tabell</Label>
      <Search
        id="table-search"
        value={searchValue}
        onChange={onChange}
        onClear={onClear}
        size="medium"
        variant="simple"
      />
    </div>
  );
};

export default TableSearch;
