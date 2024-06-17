import ImageGallery from '@common/image-edit/ImageGallery';
import { getSeverity, scoreToPercentage } from '@common/table/util';
import { Tag } from '@digdir/designsystemet-react';
import { TesterResult } from '@maaling/api/types';
/**
 * getTestresultatColumns function returns an array of column definitions for TestResultat.
 *
 * @returns {Array<ColumnDef<TesterResult>>} An array of column definitions.
 */
import { FaceFrownIcon } from '@navikt/aksel-icons';
import { ResultatOversiktLoeysing } from '@resultat/types';
import { ColumnDef } from '@tanstack/react-table';
import { Bilde } from '@test/api/types';
import React from 'react';
import { Link } from 'react-router-dom';

const getSmiley = (resultat: string): string => {
  if (resultat.toLowerCase() === 'samsvar') {
    return 'smiley-glad';
  } else return 'smiley-sur';
};

export const getViolationsColumns = (): Array<ColumnDef<TesterResult>> => [
  {
    accessorFn: (row) => row.side,
    id: 'side',
    cell: (info) => (
      <Link to={String(info.getValue())} target="_blank">
        {String(info.getValue())}
      </Link>
    ),
    header: () => <>Side</>,
  },
  {
    accessorFn: (row) =>
      row.testregelNoekkel +
      ' ' +
      (row.elementOmtale?.description ?? row.elementOmtale?.pointer),
    id: 'element',
    cell: (info) => info.getValue(),
    header: () => <>Element</>,
  },

  {
    accessorFn: (row) => row.elementResultat,
    id: 'resultat',
    cell: (info) => (
      <FaceFrownIcon
        className={getSmiley(String(info.getValue()))}
      ></FaceFrownIcon>
    ),
    header: () => <>Resultat</>,
  },
  {
    accessorFn: (row) => row.elementUtfall,
    id: 'utfall',
    cell: (info) => info.getValue(),
    header: () => <>Utfall</>,
  },
  {
    accessorFn: (row) => row.bilder,
    id: 'bilder',
    cell: (info) => {
      const bilder = info.getValue() as Bilde[];
      return <ImageGallery bilder={bilder} heading={''} />;
    },
    header: () => <>Bilder</>,
  },
  {
    accessorFn: (row) => row.kommentar,
    id: 'kommentar',
    cell: (info) => info.getValue(),
    header: () => <>Kommentar</>,
  },
];

export const getResultColumns = (): Array<
  ColumnDef<ResultatOversiktLoeysing>
> => [
  {
    accessorKey: 'kravTittel',
    header: 'Krav',
  },
  {
    accessorKey: 'score',
    header: 'Resultat',
    enableGlobalFilter: false,
    enableColumnFilter: false,
    cell: ({ row }) => (
      <Tag
        size="small"
        color={getSeverity(scoreToPercentage(row.getValue('score')))}
      >
        {scoreToPercentage(row.getValue('score'))}
      </Tag>
    ),
  },
  {
    accessorKey: 'testar',
    header: 'testar',
    enableGlobalFilter: false,
    enableColumnFilter: false,
  },
  {
    accessorKey: 'talTestaElement',
    header: 'talTestaElement',
    enableGlobalFilter: false,
    enableColumnFilter: false,
  },
  {
    accessorKey: 'talElementSamsvar',
    header: 'talElementSamsvar',
    enableGlobalFilter: false,
    enableColumnFilter: false,
  },
  {
    accessorKey: 'talElementBrot',
    header: 'talElementBrot',
    enableGlobalFilter: false,
    enableColumnFilter: false,
  },
];
