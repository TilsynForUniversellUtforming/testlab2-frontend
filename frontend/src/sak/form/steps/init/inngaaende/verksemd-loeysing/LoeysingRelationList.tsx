import { isNotDefined } from '@common/util/validationUtils';
import { Chip, Heading } from '@digdir/designsystemet-react';
import { LoeysingNettsideRelationTest, SakFormState } from '@sak/types';
import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

interface Props {
  loeysingList?: LoeysingNettsideRelationTest[];
}

const LoeysingRelationList = ({ loeysingList }: Props) => {
  const { setValue } = useFormContext<SakFormState>();

  const handleClickToggle = useCallback((index: number, useInTest: boolean) => {
    setValue(
      `verksemdLoeysingRelation.loeysingList.${index}.useInTest`,
      useInTest
    );
  }, []);

  if (isNotDefined(loeysingList)) {
    return null;
  }

  return (
    <>
      <Heading size="small" level={3} spacing>
        Nettstader
      </Heading>
      <div className="sak-loeysing__inngaaende-selection">
        {loeysingList.map((loeysingRelation, index) => {
          if (!loeysingRelation?.loeysing?.namn) {
            return null;
          }

          return (
            <Chip.Toggle
              key={loeysingRelation.loeysing.id}
              checkmark={false}
              selected={loeysingRelation.useInTest}
              onClick={() =>
                handleClickToggle(index, !loeysingRelation.useInTest)
              }
            >
              {loeysingRelation.loeysing.namn}
            </Chip.Toggle>
          );
        })}
      </div>
    </>
  );
};

export default LoeysingRelationList;
