import { CellCheckboxId } from '@common/table/types';
import UserActionTable from '@common/table/UserActionTable';
import { ButtonSize } from '@common/types';
import { sanitizeEnumLabel } from '@common/util/stringutils';
import { Button } from '@digdir/designsystemet-react';
import { Row } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';

import { KontrollListItem, KontrollType } from '../types';
import classes from './kontroll-list.module.css';

const StyringsdataLinkButton = ({
  kontrollId,
  styringsdataId,
}: {
  kontrollId: number;
  styringsdataId?: number;
}) => {
  const styringsdataParam = styringsdataId
    ? `?styringsdataId=${styringsdataId}`
    : '';

  const text = styringsdataId ? 'Endre styringsdata' : 'Legg til styringsdata';
  return (
    <Link to={`../../styringsdata/${kontrollId}${styringsdataParam}`}>
      <Button size={ButtonSize.Small}>{text}</Button>
    </Link>
  );
};

const KontrollList = () => {
  const filters: KontrollType[] = [
    KontrollType.InngaaendeKontroll,
    KontrollType.ForenklaKontroll,
    KontrollType.Tilsyn,
    KontrollType.Statusmaaling,
    KontrollType.UttaleSak,
    KontrollType.Anna,
  ];

  const kontroller = useLoaderData() as KontrollListItem[];
  const [kontrollList, setKontrollList] = useState<KontrollListItem[]>(
    kontroller ?? []
  );
  const [kontrollFilter, setKontrollFilter] = useState<KontrollType>(
    KontrollType.InngaaendeKontroll
  );

  useEffect(() => {
    if (kontroller) {
      setKontrollList(
        kontroller.filter((k) => k.kontrolltype === kontrollFilter)
      );
    }
  }, [kontrollFilter]);

  const navigate = useNavigate();

  return (
    <section className={classes.kontrollList}>
      <UserActionTable<KontrollListItem>
        heading="Alle kontroller"
        tableProps={{
          classNames: [classes.kontrollerTabell],
          data: kontrollList,
          defaultColumns: [
            {
              accessorFn: (row) => row.tittel,
              id: 'tittel',
              cell: ({ getValue }) => getValue(),
              header: () => <>Tittel</>,
            },
            {
              accessorFn: (row) => row.virksomheter.join(','),
              id: 'virksomhet',
              cell: ({ row }) =>
                row.original.virksomheter.length > 1
                  ? `${row.original.virksomheter.length} virksomheter`
                  : row.original.virksomheter[0],
              header: () => <>Virksomhet</>,
            },
            {
              accessorFn: (row) => row.saksbehandler,
              id: 'saksbehandler',
              cell: (info) => info.getValue(),
              header: () => <>Ansvarlig</>,
            },
            {
              id: 'frister',
              cell: () => '',
              header: () => <>Frister</>,
            },
            {
              id: 'progresjon',
              cell: () => '',
              header: () => <>Progresjon</>,
            },
            {
              id: `${CellCheckboxId} merknad`,
              cell: () => <Button variant="tertiary">Ny merknad</Button>,
              header: () => <>Merknad</>,
            },
            {
              accessorFn: (row) => row.kontrolltype,
              id: 'kontrolltype',
              cell: (info) => sanitizeEnumLabel(String(info.getValue())),
              header: () => <>Testtype</>,
            },
            {
              id: `${CellCheckboxId} styringsdataId`,
              cell: ({ row }) => (
                <StyringsdataLinkButton
                  kontrollId={row.original.id}
                  styringsdataId={row.original.styringsdataId}
                />
              ),
              header: () => <>Styringsdata</>,
            },
          ],
          onClickRow: (row?: Row<KontrollListItem>) =>
            row
              ? navigate(
                  kontrollFilter === 'forenkla-kontroll'
                    ? `/maaling?kontrollId=${row.original.id}`
                    : `/kontroll/${row.original.id}/oppsummering`
                )
              : null,
        }}
      >
        <div className={classes.filter}>
          {filters.map((s) => (
            <label key={s}>
              {sanitizeEnumLabel(s)}
              <input
                id={`filter-${s}`}
                type="radio"
                name="kontroller-filter"
                hidden
                value={s}
                defaultChecked={s === kontrollFilter}
                onChange={(event) =>
                  setKontrollFilter(event.target.value as KontrollType)
                }
              />
            </label>
          ))}
        </div>
      </UserActionTable>
    </section>
  );
};

export default KontrollList;
