import { useEffect, useState } from 'react';
import { Path, PathValue } from 'react-hook-form';

export interface Props<FormData, ResultData> {
  resultList: ResultData[];
  resultLabelKey: keyof ResultData;
  onClick: (name: Path<FormData>, result: ResultData) => void;
  show: boolean;
  name: Path<FormData>;
  resultDescriptionKey?: keyof ResultData;
  maxListLength?: number;
}

const TestlabFormAutocompleteList = <
  FormData extends object,
  ResultData extends PathValue<FormData, Path<FormData>>,
>({
  resultList,
  resultLabelKey,
  onClick,
  show,
  name,
  resultDescriptionKey,
  maxListLength = 10,
}: Props<FormData, ResultData>) => {
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
        const resultLabel =
          typeof result[resultLabelKey] === 'string'
            ? result[resultLabelKey]
            : null;

        const resultDescription =
          resultDescriptionKey &&
          typeof result[resultDescriptionKey] === 'string'
            ? result[resultDescriptionKey]
            : null;

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
                  {resultLabel}
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
