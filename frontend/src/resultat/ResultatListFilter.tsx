import { Heading, Label, Search } from '@digdir/designsystemet-react';
import { ChangeEvent } from 'react';

interface Props {
  searchValue: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onChangeBeforeDate: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeAfterDate: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (value: string) => void;
}
const ResultatTableFilter = ({
  searchValue,
  onChange,
  onClear,
  onChangeBeforeDate,
  onChangeAfterDate,
  onSubmit,
}: Props) => {
  return (
    <div className="resultat-header-search">
      <Heading size="medium" level={2} spacing>
        Filtrer visning
      </Heading>
      <div id="kontrollTypeFilter">
        <Label htmlFor="table-search">Søk i etter type kontroll</Label>
        <Search
          id="table-search"
          value={searchValue}
          onChange={onChange}
          onClear={onClear}
          onSearchClick={onSubmit}
          size="medium"
          variant="primary"
          searchButtonLabel="Filtrer"
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

export default ResultatTableFilter;
