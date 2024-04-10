import ConditionalComponentContainer from '@common/ConditionalComponentContainer';
import { Heading, Paragraph } from '@digdir/designsystemet-react';
import {
  Regelsett,
  TestregelBase,
  TestregelModus,
} from '@testreglar/api/types';
import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { useLoaderData } from 'react-router-dom';

import classes from '../kontroll.module.css';
import RegelsettSelector from './RegelsettSelector';
import TestregelFilter from './TestregelFilter';
import TestregelSelector from './TestregelSelector';
import { ModusFilter, SelectionType, VelgTestreglarLoader } from './types';

const filterByModus = <T extends { modus: TestregelModus }>(
  list: T[],
  modus: ModusFilter
): T[] => {
  if (modus !== 'begge') {
    return list.filter((item) => item.modus === modus);
  }
  return list;
};

const VelgTestreglar = () => {
  const { testregelList, regelsettList } =
    useLoaderData() as VelgTestreglarLoader;
  const [selectionType, setSelectionType] =
    useState<SelectionType>('regelsett');
  const [selectedRegelsettId, setSelectedRegelsettId] = useState<number>();
  const [selectedTestregelIdList, setSelectedTestregelIdList] = useState<
    number[]
  >([]);
  const [selectAll, setSelectAll] = useState(true);
  const [modus, setModus] = useState<ModusFilter>('manuell');
  const [filteredTestregelList, setFilteredTestregelList] = useState<
    TestregelBase[]
  >(filterByModus(testregelList, modus));
  const [filteredRegelsettList, setFilteredRegelsettList] = useState<
    Regelsett[]
  >(filterByModus(regelsettList, modus));

  const toggleSelectAll = () => {
    setSelectAll((selectAll) => !selectAll);
  };

  const onSelectRegelsett = (regelsettId: number) => {
    const selectedRegelsett = regelsettList.find((rs) => rs.id === regelsettId);
    if (!selectedRegelsett) {
      throw new Error('Valgt regelsett finns ikkje');
    }

    setSelectedRegelsettId((prev) => {
      if (prev === regelsettId) {
        return undefined;
      } else {
        return regelsettId;
      }
    });
    setSelectedTestregelIdList([]);
  };

  const onChangeModus = useCallback(
    (modus: ModusFilter) => {
      setModus(modus);

      setFilteredTestregelList(filterByModus(testregelList, modus));
      setFilteredRegelsettList(filterByModus(regelsettList, modus));

      setSelectedRegelsettId(undefined);
      setSelectedTestregelIdList([]);
    },
    [selectionType]
  );

  const onSelectTestregelId = (testregelId: number) => {
    const selectedTestregel = testregelList.find((tr) => tr.id === testregelId);
    if (!selectedTestregel) {
      throw new Error('Valgt regelsett finns ikkje');
    }
    setSelectedTestregelIdList((prev) => {
      const isAlreadySelected = prev.includes(testregelId);
      if (isAlreadySelected) {
        return prev.filter((id) => id !== testregelId);
      } else {
        return [...prev, testregelId];
      }
    });
    setSelectedRegelsettId(undefined);
  };

  const regelsettSelected = selectionType === 'regelsett';

  return (
    <section className={classes.byggKontroll}>
      <nav className={classes.stepper}>
        <ol>
          <li>Opprett kontroll</li>
          <li>Velg løsninger</li>
          <li>Gjennomfør sideutvalg</li>
          <li className={classes.selected}>Testregler</li>
          <li>Oppsummering</li>
        </ol>
      </nav>
      <div className={classes.velgTestreglarOverskrift}>
        <Heading level={1} size="xlarge">
          Vel testreglar
        </Heading>
        <Paragraph>
          Vel hvilke testreglar du vil ha med inn i kontrollen
        </Paragraph>
      </div>
      <div className={classes.testregelEllerManuelt}>
        <button
          onClick={() => setSelectionType('regelsett')}
          className={classNames({
            [classes.selected]: regelsettSelected,
          })}
        >
          Vel testregelsett
        </button>
        <button
          onClick={() => setSelectionType('testregel')}
          className={classNames({
            [classes.selected]: !regelsettSelected,
          })}
        >
          Vel testreglar selv
        </button>
      </div>
      <div className={classes.testreglarValgWrapper}>
        <TestregelFilter
          heading={
            regelsettSelected ? 'Vel testregelsett' : 'Vel testreglar selv'
          }
          switchTitle={
            regelsettSelected
              ? 'Vel same regelsett til alle løysingar'
              : 'Vel same testrelgar til alle løysingar'
          }
          selectAll={selectAll}
          onToggleSelectAll={toggleSelectAll}
          modus={modus}
          onChangeModus={onChangeModus}
        />
        <div className={classes.testreglarValg}>
          <ConditionalComponentContainer
            condition={regelsettSelected}
            conditionalComponent={
              <RegelsettSelector
                regelsettList={filteredRegelsettList}
                onSelectRegelsett={onSelectRegelsett}
                selectedRegelsettId={selectedRegelsettId}
              />
            }
            otherComponent={
              <TestregelSelector
                testregelList={filteredTestregelList}
                selectedTestregelIdList={selectedTestregelIdList}
                onSelectTestregelId={onSelectTestregelId}
              />
            }
          />
        </div>
      </div>
    </section>
  );
};

export default VelgTestreglar;
