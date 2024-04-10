import { ButtonSize, ButtonVariant } from '@common/types';
import { Alert, Button, Checkbox, Heading } from '@digdir/designsystemet-react';
import { TestregelBase } from '@testreglar/api/types';
import { useMemo } from 'react';

import classes from '../kontroll.module.css';

interface Props {
  testregelList: TestregelBase[];
  selectedTestregelIdList: number[];
  onSelectTestregelId: (testregelIdList: string[]) => void;
}

const TestregelSelector = ({
  testregelList,
  selectedTestregelIdList,
  onSelectTestregelId,
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

  if (testregelList.length === 0) {
    return (
      <Alert severity="info">
        Ingen testrelgar for valgt type tilgjengelig
      </Alert>
    );
  }

  return (
    <>
      <Heading size="xsmall" level={4}>
        Vel testreglar og sukesskriteriar som skal væra med i testen din
      </Heading>
      <div className={classes.gridContainer}>
        {[...groupedTestreglar.entries()].map(([krav, testreglar]) => (
          <div key={krav} className={classes.gridItem}>
            <Heading size="xxsmall" level={5}>
              {krav}
            </Heading>
            <Button size={ButtonSize.Small} variant={ButtonVariant.Quiet}>
              Vel alle
            </Button>
            <br />
            <Checkbox.Group
              legend={krav}
              hideLegend
              onChange={onSelectTestregelId}
              value={selectedTestregelIdList.map((id) => String(id))}
              size="small"
            >
              {testreglar.map((testregel) => (
                <Checkbox key={testregel.id} value={String(testregel.id)}>
                  {testregel.namn}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </div>
        ))}
      </div>
    </>
  );
};

export default TestregelSelector;
