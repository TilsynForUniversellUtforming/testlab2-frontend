import { Path, PathValue } from 'react-hook-form';

export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? Key | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : Key;
}[keyof ObjectType & (string | number)];

export const resultToString = <
  FormDataType extends object,
  ResultDataType extends PathValue<FormDataType, Path<FormDataType>>,
>(
  result: ResultDataType,
  resultLabelKey: NestedKeyOf<ResultDataType>
): string =>
  typeof result[resultLabelKey] === 'string'
    ? (result[resultLabelKey] as string)
    : '';
