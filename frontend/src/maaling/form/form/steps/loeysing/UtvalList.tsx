import { getErrorMessage } from '@common/form/util';
import { Fieldset, Radio } from '@digdir/designsystemet-react';
import { MaalingContext, MaalingFormState } from '@maaling/types';
import { useFormContext } from 'react-hook-form';
import { useOutletContext } from 'react-router-dom';

const UtvalList = () => {
  const { setValue, clearErrors, getValues, formState } =
    useFormContext<MaalingFormState>();
  const { utvalList }: MaalingContext = useOutletContext();

  const handleChangeUtval = (value?: string) => {
    const utval = utvalList.find((u) => u.id === Number(value));
    setValue('utval', utval);
    clearErrors();
  };

  const errorMessage = getErrorMessage(formState, 'utval');

  return (
    <Fieldset>
      <Fieldset.Legend>
        Velg eit utval
      </Fieldset.Legend>
      {utvalList.length === 0 && (
        <Fieldset.Description>
          <em>
            Det finnes ingen lagra utval. Du må enten leggje til løysingar sjølv,
            eller lage eit utval før du oppretter ei ny måling.
          </em>
        </Fieldset.Description>
      )}
        {utvalList.map((u) => (
          <Radio value={String(u.id)} key={String(u.id)} label={u.namn} onClick={() => handleChangeUtval(String(u.id))} checked={getValues("utval")!!.id == u.id} />
        ))}
    </Fieldset>
  );
};

export default UtvalList;
