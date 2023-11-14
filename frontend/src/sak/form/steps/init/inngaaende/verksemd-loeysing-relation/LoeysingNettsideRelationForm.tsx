import { isDefined } from '@common/util/validationUtils';
import { Accordion, Chip, Paragraph } from '@digdir/design-system-react';
import LoeysingNettsideForm from '@sak/form/steps/init/inngaaende/verksemd-loeysing-relation/LoeysingNettsideForm';
import { LoeysingNettsideRelation, SakFormState } from '@sak/types';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface Props {
  loeysingNettsideRelationList: LoeysingNettsideRelation[];
}

const LoeysingNettsideRelationForm = ({
  loeysingNettsideRelationList,
}: Props) => {
  const { formState } = useFormContext<SakFormState>();
  const [open, setOpen] = useState<boolean[]>(
    Array(loeysingNettsideRelationList.length).fill(true)
  );

  const onClickOpen = (open: boolean[], index: number) => {
    const updatedOpen = [...open];
    updatedOpen[index] = !updatedOpen[index];
    setOpen(updatedOpen);
  };

  const listErrors = formState?.errors?.verksemdLoeysingRelation?.loeysingList;

  return (
    <>
      <Paragraph spacing>Utvalgte nettsteder</Paragraph>
      <div className="sak-loeysing__inngaaende-selection">
        {loeysingNettsideRelationList?.map((loeysingRelation) => {
          if (!loeysingRelation?.loeysing?.namn) {
            return null;
          }

          return (
            <Chip.Toggle key={loeysingRelation.loeysing.id}>
              {loeysingRelation.loeysing.namn}
            </Chip.Toggle>
          );
        })}
      </div>
      <Accordion border>
        {loeysingNettsideRelationList.map((lnr, index) => (
          <Accordion.Item
            key={lnr.loeysing.id}
            color="second"
            open={
              open[index] ||
              isDefined(listErrors ? listErrors[index] : undefined)
            }
          >
            <Accordion.Header onHeaderClick={() => onClickOpen(open, index)}>
              {lnr.loeysing.namn}
            </Accordion.Header>
            <Accordion.Content>
              <LoeysingNettsideForm
                heading={lnr.loeysing?.namn}
                index={index}
              />
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion>
    </>
  );
};

export default LoeysingNettsideRelationForm;
