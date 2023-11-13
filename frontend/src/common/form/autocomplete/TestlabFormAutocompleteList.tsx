import { NestedKeyOf } from '@common/form/autocomplete/util';
import { useEffect, useState } from 'react';
import { get, Path, PathValue } from 'react-hook-form';

export interface Props<
  FormDataType extends object,
  ResultDataType extends PathValue<FormDataType, Path<FormDataType>>,
> {
  resultList: ResultDataType[];
  resultLabelKey: NestedKeyOf<ResultDataType>;
  onClick: (name: Path<FormDataType>, result: ResultDataType) => void;
  show: boolean;
  name: Path<FormDataType>;
  resultDescriptionKey?: NestedKeyOf<ResultDataType>;
  maxListLength?: number;
}

const TestlabFormAutocompleteList = <
  FormDataType extends object,
  ResultDataType extends PathValue<FormDataType, Path<FormDataType>>,
>({
  resultList,
  resultLabelKey,
  onClick,
  show,
  name,
  resultDescriptionKey,
  maxListLength = 10,
}: Props<FormDataType, ResultDataType>) => {
  const [listLength, setListLength] = useState(maxListLength);
  const [results, setResults] = useState(resultList.slice(0, maxListLength));

  useEffect(() => {
    setResults(resultList.slice(0, listLength));
  }, [resultList, listLength]);

  if (!show) {
    return null;
  }

  return (
    <>
      {results.slice(0, listLength).map((result, idx) => {
        const resultLabel = get(result, String(resultLabelKey)) || '';
        const resultDescription =
          get(result, String(resultDescriptionKey)) || '';

        return (
          <li
            className="testlab-form-autocomplete__list-item"
            key={`${resultLabel}_${idx}`}
          >
            <div className="button-wrapper">
              <button
                type="button"
                onClick={() => onClick(name, result)}
                className="testlab-form-autocomplete__list__button"
              >
                <div className="testlab-form-autocomplete__list__button-title">
                  {String(resultLabel)}
                </div>
                {resultDescription && (
                  <div className="testlab-form-autocomplete__list__button-description">
                    {resultDescription}
                  </div>
                )}
              </button>
            </div>
          </li>
        );
      })}
      {resultList.length > listLength && (
        <li className="testlab-form-autocomplete__list-item">
          <div className="button-wrapper">
            <button
              type="button"
              onClick={() => setListLength((listLength) => listLength + 10)}
              className="testlab-form-autocomplete__list__button"
            >
              ...
            </button>
          </div>
        </li>
      )}
    </>
  );
};

export default TestlabFormAutocompleteList;
