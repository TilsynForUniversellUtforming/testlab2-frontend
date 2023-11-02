import { AutoCompleteProps } from '@common/form/autocomplete/TestlabFormAutocomplete';
import { TestlabInputBaseProps } from '@common/form/TestlabFormInput';
import { TestlabInputSelectProps } from '@common/form/TestlabFormSelect';
import { ReactElement } from 'react';
import {
  ArrayPath,
  FieldArray,
  Path,
  PathValue,
  useFieldArray,
  useFormContext,
} from 'react-hook-form';

// const Total = ({ control }: { control: Control<FormValues> }) => {
//   const formValues = useWatch({
//     name: "cart",
//     control
//   });
//   const total = formValues.reduce(
//     (acc, current) => acc + (current.price || 0) * (current.quantity || 0),
//     0
//   );
//   return <p>Total Amount: {total}</p>;
// };

// type ValidInputs = typeof TestlabFormInput | typeof TestlabFormSelect | typeof TestlabFormAutocomplete;

interface Props<
  FormData extends object,
  ResultData extends PathValue<FormData, Path<FormData>>,
> {
  name: ArrayPath<FormData>;
  defaultValues: FieldArray<FormData, ArrayPath<FormData>>;
  child: ReactElement<
    | TestlabInputBaseProps<FormData>
    | TestlabInputSelectProps<FormData>
    | AutoCompleteProps<FormData, ResultData>
  >;
}

const TestlabFormFieldArray = <
  FormData extends object,
  ResultData extends PathValue<FormData, Path<FormData>>,
>({
  name,
  defaultValues,
}: Props<FormData, ResultData>) => {
  const { control /*formState*/ } = useFormContext<FormData>();

  const { fields, append, remove } = useFieldArray({
    name: name,
    control,
  });

  return (
    <div>
      {fields.map((field, index) => {
        return (
          <div key={field.id}>
            <section className={'section'} key={field.id}>
              <button type="button" onClick={() => remove(index)}>
                DELETE
              </button>
              <button type="button" onClick={() => append(defaultValues)}>
                APPEND
              </button>
            </section>
          </div>
        );
      })}

      {/*<Total control={control} />*/}
      {/*<input type="submit" />*/}
    </div>
  );
};

export default TestlabFormFieldArray;
