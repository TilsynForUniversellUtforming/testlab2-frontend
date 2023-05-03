import { List, ListItem } from '@digdir/design-system-react';
import React from 'react';
import { Link } from 'react-router-dom';

import { appRoutes, getFullPath, idPath } from '../../../common/appRoutes';
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
            to={getFullPath(appRoutes.MAALING, {
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
