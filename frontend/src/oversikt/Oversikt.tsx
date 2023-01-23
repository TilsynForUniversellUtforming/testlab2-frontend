import './oversikt.scss';

import { testing, verktoey } from '../common/paths';
import Lenker from './lenker/Lenker';

const Oversikt = () => {
  return (
    <div className="oversikt">
      <Lenker tittel="Verktøy" paths={verktoey} />
      <Lenker tittel="Testing" paths={testing} />
    </div>
  );
};

export default Oversikt;
