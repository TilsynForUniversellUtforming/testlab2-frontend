import { Alert, Checkbox, Fieldset, Heading } from '@digdir/designsystemet-react';
import { TestregelBase, TestregelModus } from '@testreglar/api/types';
import { ChangeEvent, useMemo } from 'react';

import classes from '../kontroll.module.css';

interface Props {
  testregelList: TestregelBase[];
  selectedTestregelIdList: number[];
  onSelectTestregelId: (testregelIdList: number[]) => void;
  modus: TestregelModus;
  isInngaaende: boolean;
  isForenkla: boolean;
}

const TestregelSelector = ({
  testregelList,
  selectedTestregelIdList,
  onSelectTestregelId,
  modus,
  isForenkla,
}: Props) => {
  const groupedTestreglar = useMemo(() => {
    const groups = new Map<string, TestregelBase[]>();
    testregelList.forEach((testregel) => {
      const krav = `${testregel.krav.tittel}`;
      if (!groups.has(krav)) {
        groups.set(krav, []);
      }
      groups.get(krav)?.push(testregel);
    });
    return new Map([...groups.entries()].sort());
  }, [testregelList]);

  if (isForenkla && modus !== 'automatisk') {
    return (
      <Alert data-color="warning">
        Kombinasjon av automatiske og manuelle testreglar er ikkje mogleg ennå
      </Alert>
    );
  }

  if (testregelList.length === 0) {
    return (
      <Alert data-color="info">
        Ingen testrelgar for valgt type tilgjengelig
      </Alert>
    );
  }

  const onChangeTestregel = (testregel: TestregelBase) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        onSelectTestregelId([...selectedTestregelIdList, testregel.id]);
      } else {
        onSelectTestregelId(selectedTestregelIdList.filter((v) => v !== testregel.id));
      }
    };
  }
  return (
    <div className={classes.gridWrapper}>
      <div className={classes.gridContainer}>
        {[...groupedTestreglar.entries()].map(([krav, testreglar]) => (
          <div key={krav} className={classes.gridItem}>
            <Heading data-size="2xs" level={6}>
              {krav}
            </Heading>
            <br />
            <Fieldset>
              {testreglar.map((testregel) => (
                <Checkbox
                  key={testregel.id}
                  value={String(testregel.id)}
                  title={`Vel ${testregel.namn}`}
                  onChange={onChangeTestregel(testregel)}
                  label={testregel.namn}
                  data-testid="manuell-testregel"
                data-size={"sm"} />
              ))}
            </Fieldset>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestregelSelector;
