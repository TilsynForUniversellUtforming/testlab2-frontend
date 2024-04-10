import { Alert, Checkbox } from '@digdir/designsystemet-react';
import { TestregelBase } from '@testreglar/api/types';
import { useMemo } from 'react';

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
    <div>
      {[...groupedTestreglar.entries()].map(([krav, testreglar]) => (
        <Checkbox.Group
          key={krav}
          legend={krav}
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
      ))}
    </div>
  );
};

export default TestregelSelector;
