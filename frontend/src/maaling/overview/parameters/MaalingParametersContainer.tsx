import React from 'react';
import { Link } from 'react-router-dom';

import { appRoutes, getFullPath, idPath } from '../../../common/appRoutes';
import { Maaling } from '../../api/types';

export interface Props {
  id: string;
  maaling: Maaling;
}

const MaalingParametersContainer = ({ id, maaling }: Props) => (
  <ol className="w-75">
    <li>
      <div>
        <div className="fw-bold">Type:</div>
        {/*TODO - Ikke implementert for måling ennå */}
        <div>Kontroll</div>
      </div>
    </li>
    <li>
      <div>
        <div className="fw-bold">Sak:</div>
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
        {/*TODO - Kommenter ut til når opplegg for sak er laget*/}
        {/*<div><Link to={getFullPath(appRoutes.SAK, maaling.sakId)}>{maaling.sakNavn}</Link></div>*/}
      </div>
    </li>
    <li>
      <div>
        <div className="fw-bold">Dato start:</div>
        <div>{new Date().toISOString()}</div>
        {/*TODO - Kommenter ut til når måling har dato*/}
        {/*<div>{maaling.dateStart}</div>*/}
      </div>
    </li>
    <li>
      <div>
        <div className="fw-bold">Dato avslutta:</div>
        <div>Pågår</div>
        {/*TODO - Kommenter ut til når måling har dato*/}
        {/*<div>{maaling.dateEnd}</div>*/}
      </div>
    </li>
  </ol>
);

export default MaalingParametersContainer;
