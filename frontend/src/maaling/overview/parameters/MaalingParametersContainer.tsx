import { getFullPath, idPath } from '@common/util/routeUtils';
import { formatDateString } from '@common/util/stringutils';
import { List, ListItem } from '@digdir/design-system-react';
import { MAALING } from '@maaling/MaalingRoutes';
import React from 'react';
import { Link } from 'react-router-dom';

import { Maaling } from '../../api/types';

export interface Props {
  id: string;
  maaling: Maaling;
}

const MaalingParametersContainer = ({ id, maaling }: Props) => (
  <List>
    <ListItem>
      <div className="parameter__item">
        <div className="bold-text">Type</div>
        <div>Kontroll</div>
      </div>
    </ListItem>
    <ListItem>
      <div className="parameter__item">
        <div className="bold-text">Sak</div>
        <div>
          <Link
            to={getFullPath(MAALING, {
              pathParam: idPath,
              id: id,
            })}
          >
            {maaling.navn}
          </Link>
        </div>
      </div>
    </ListItem>
    <ListItem>
      <div className="parameter__item">
        <div className="bold-text">Dato start</div>
        <div>{formatDateString(maaling.datoStart)}</div>
      </div>
    </ListItem>
    <ListItem>
      <div className="parameter__item">
        <div className="bold-text">Dato avslutta</div>
        <div>Pågår</div>
      </div>
    </ListItem>
  </List>
);

export default MaalingParametersContainer;
