import type { FieldPath, FieldValues, FormState } from 'react-hook-form';

export const isFormError = <
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
>(
  form: FormState<TFieldValues>,
  name: TFieldName
) => !!form.errors[name] && (!!form.touchedFields[name] || form.isSubmitted);
