import { sanitizeEnumLabel } from '@common/util/stringutils';
import { Heading, List } from '@digdir/designsystemet-react';
import ResultatTableFilter from '@resultat/ResultatListFilter';
import { TypeKontroll } from '@resultat/types';
import { Column } from '@tanstack/react-table';
import React, { ChangeEvent, useCallback, useState } from 'react';

export interface HeaderProps<T extends object> {
  filterColumns?: Column<T, unknown>[];
  kontrollNamn?: string;
  loeysingNamn?: string;
  typeKontroll?: string;
  subHeader?: string;
  onSubmitCallback?: (value: string) => void;
}

const ResultTableHeader = <T extends object>({
  filterColumns,
  kontrollNamn,
  typeKontroll,
  loeysingNamn,
  subHeader,
  onSubmitCallback,
}: HeaderProps<T>) => {
  const [searchValue, setSearchValue] = useState('');
  const [beforeDate, setBeforeDate] = useState<Date | undefined>();
  const [afterDate, setafterDate] = useState<Date | undefined>();

  const onSearchClick = (value: string) => {
    if (onSubmitCallback) {
      onSubmitCallback(value);
    } else {
      onSubmit(value);
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const kontrollTypeColumn = filterColumns ? filterColumns[0] : undefined;
  const dateColumn = filterColumns ? filterColumns[1] : undefined;

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
        const typeKontroll = findTypeKontroll(searchValue) ?? searchValue;
        kontrollTypeColumn.setFilterValue(typeKontroll);
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

  const onSubmit = (value: string) => {
    filterColumn(value);
  };

  const typeMaaling = (): string => {
    if (searchValue.length > 2) {
      return sanitizeEnumLabel(String(findTypeKontroll(searchValue))) ?? '';
    }
    return typeKontroll ? typeKontroll : '';
  };

  const findTypeKontroll = (value: string): TypeKontroll | undefined => {
    if (
      value.length > 2 &&
      TypeKontroll.InngaaendeKontroll.toString()
        .toLowerCase()
        .startsWith(value.toLowerCase())
    ) {
      return TypeKontroll.InngaaendeKontroll;
    } else if (
      value.length > 2 &&
      TypeKontroll.ForenklaKontroll.toString()
        .toLowerCase()
        .startsWith(value.toLowerCase())
    ) {
      return TypeKontroll.ForenklaKontroll;
    }
  };
  const periode = (): string => {
    return (
      (afterDate ? afterDate.toLocaleDateString() : ' ') +
      ' - ' +
      (beforeDate ? beforeDate.toLocaleDateString() : ' ')
    );
  };

  const isTopPage = (): boolean => {
    return dateColumn !== undefined || onSubmitCallback !== undefined;
  };

  return (
    <div className="resultat-header">
      <div className={'resultat-header-headings'}>
        <Heading size="xlarge" level={1} spacing={true}>
          Resultatvisning
        </Heading>
        <Heading size="large" level={2} spacing={true}>
          {subHeader}
        </Heading>
      </div>

      {isTopPage() && (
        <ResultatTableFilter
          searchValue={searchValue}
          onChange={onChange}
          onClear={onClear}
          onChangeBeforeDate={onChangeBeforeDate}
          onChangeAfterDate={onChangeAfterDate}
          onSubmit={onSearchClick}
        />
      )}
      <div className="resultat-header-status">
        <List.Root>
          <List.Heading level={2} size={'small'}>
            Resultater
          </List.Heading>
          <List.Unordered
            style={{
              listStyle: 'none',
              paddingLeft: 0,
            }}
          >
            <List.Item>
              <strong>Type måling:</strong> {typeMaaling()}
            </List.Item>
            {isTopPage() && (
              <List.Item>
                <strong>Periode:</strong> {periode()}
              </List.Item>
            )}
            {kontrollNamn && (
              <List.Item>
                <strong>Namn {kontrollNamn}</strong>
              </List.Item>
            )}
            {loeysingNamn && (
              <List.Item>
                <strong>Resultat:</strong> {loeysingNamn}
              </List.Item>
            )}
          </List.Unordered>
        </List.Root>
      </div>
    </div>
  );
};

export default ResultTableHeader;
