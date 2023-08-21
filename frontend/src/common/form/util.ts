import type { FieldPath, FieldValues, FormState } from 'react-hook-form';
import { FieldErrors } from 'react-hook-form/dist/types/errors';

export const getErrorMessage = <
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
>(
  form: FormState<TFieldValues>,
  name: TFieldName
): string | undefined =>
  (form.errors as FieldErrors<TFieldValues>)[name]?.message as string;
