import { getErrorMessage } from '@common/form/util';
import { Fieldset, Radio } from '@digdir/design-system-react';
import { SakContext, SakFormState } from '@sak/types';
import { useFormContext } from 'react-hook-form';
import { useOutletContext } from 'react-router-dom';

const SakUtvalList = () => {
  const { setValue, clearErrors, getValues, formState } =
    useFormContext<SakFormState>();
  const { utvalList }: SakContext = useOutletContext();

  const handleChangeUtval = (value?: string) => {
    const utval = utvalList.find((u) => u.id === Number(value));
    setValue('utval', utval);
    clearErrors();
  };

  const errorMessage = getErrorMessage(formState, 'utval');

  return (
    <Fieldset legend="Velg eit utval">
      {utvalList.length === 0 && (
        <p>
          <em>
            Det finnes inga lagra utval. Du må enten leggje til løysingar sjølv,
            eller lage eit utval før du oppretter ei ny måling.
          </em>
        </p>
      )}
      <Radio.Group
        name="chooseUtval"
        value={String(getValues('utval')?.id)}
        onChange={handleChangeUtval}
        error={errorMessage}
        legend="Utval"
      >
        {utvalList.map((u) => (
          <Radio value={String(u.id)} key={String(u.id)}>
            {u.namn}
          </Radio>
        ))}
      </Radio.Group>
    </Fieldset>
  );
};

export default SakUtvalList;
