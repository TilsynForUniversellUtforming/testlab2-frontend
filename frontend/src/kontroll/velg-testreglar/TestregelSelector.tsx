import { Alert, Checkbox, Heading } from '@digdir/designsystemet-react';
import { TestregelBase, TestregelModus } from '@testreglar/api/types';
import { useMemo } from 'react';

import classes from '../kontroll.module.css';

interface Props {
  testregelList: TestregelBase[];
  selectedTestregelIdList: number[];
  onSelectTestregelId: (testregelIdList: string[]) => void;
  modus: TestregelModus;
  isInngaaende: boolean;
}

const TestregelSelector = ({
  testregelList,
  selectedTestregelIdList,
  onSelectTestregelId,
  modus,
  isInngaaende,
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

  if (
    (isInngaaende && modus !== 'manuell') ||
    (!isInngaaende && modus !== 'automatisk')
  ) {
    return (
      <Alert severity="warning">
        Kombinasjon av automatiske og manuelle testreglar er ikkje mogleg ennå
      </Alert>
    );
  }

  if (testregelList.length === 0) {
    return (
      <Alert severity="info">
        Ingen testrelgar for valgt type tilgjengelig
      </Alert>
    );
  }

  return (
    <div className={classes.gridWrapper}>
      <div className={classes.gridContainer}>
        {[...groupedTestreglar.entries()].map(([krav, testreglar]) => (
          <div key={krav} className={classes.gridItem}>
            <Heading size="xxsmall" level={6}>
              {krav}
            </Heading>
            <br />
            <Checkbox.Group
              legend={krav}
              hideLegend
              onChange={onSelectTestregelId}
              value={selectedTestregelIdList.map((id) => String(id))}
              size="small"
            >
              {testreglar.map((testregel) => (
                <Checkbox
                  key={testregel.id}
                  value={String(testregel.id)}
                  title={`Vel ${testregel.namn}`}
                >
                  {testregel.namn}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestregelSelector;
