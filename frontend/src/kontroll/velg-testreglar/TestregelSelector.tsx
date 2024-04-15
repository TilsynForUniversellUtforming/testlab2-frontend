import {
  Alert,
  Checkbox,
  Heading,
  Ingress,
} from '@digdir/designsystemet-react';
import { TestregelBase } from '@testreglar/api/types';
import { useMemo } from 'react';

import classes from '../kontroll.module.css';
import { ModusFilter } from './types';

interface Props {
  testregelList: TestregelBase[];
  selectedTestregelIdList: number[];
  onSelectTestregelId: (testregelIdList: string[]) => void;
  modus: ModusFilter;
}

const modusHeaders: { [K in ModusFilter]: string } = {
  automatisk: 'Vel automatiske testreglar',
  manuell: 'Vel manuelle testreglar',
  begge: 'Vel både manuelle og automatiske testreglar',
};

const TestregelSelector = ({
  testregelList,
  selectedTestregelIdList,
  onSelectTestregelId,
  modus,
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
    <div className={classes.gridWrapper}>
      <Heading size="small" level={4} spacing>
        {modusHeaders[modus]}
      </Heading>
      <Ingress level={5} spacing>
        Vel testreglar og sukesskriteriar som skal væra med i testen din
      </Ingress>
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
