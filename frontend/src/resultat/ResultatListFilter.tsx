import { Field, Heading, Label, Select } from '@digdir/designsystemet-react';
import { ChangeEvent } from 'react';
import { createOptionsFromLiteral } from '@common/util/stringutils';
import { KontrollType } from '../kontroll/types';
import { OptionType } from '@common/types';

interface Props {
  searchValue: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  onChangeBeforeDate: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeAfterDate: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (value: string) => void;
}
const ResultatTableFilter = ({
  searchValue,
  onChange,
  onChangeBeforeDate,
  onChangeAfterDate,
  onSubmit,
}: Props) => {
  const options:  OptionType[] = createOptionsFromLiteral<KontrollType>(
    Object.values(KontrollType)
  )

  return (
    <div className="resultat-header-search">
      <Heading data-size="md" level={2}>
        Filtrer visning
      </Heading>
      <Field id="kontrollTypeFilter">
        <Label htmlFor="table-search">Filtrer etter type kontroll</Label>
        <Select onChange={onChange} value={searchValue}>
          {options.map((o) => (
              <Select.Option
                value={o.value}
                key={`${o.label}_${o.value}`}
                label={o.label?.toString() ?? o.label}
              >
                {o.value} {o.label}
            </Select.Option>
          ))
          }
        </Select>
      </Field>
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
