import { testing, verktoey } from '../common/routes';
import Lenker from './lenker/Lenker';

const Oversikt = () => {
  return (
    <>
      <Lenker tittel="Verktøy" routes={verktoey} />
      <Lenker tittel="Testing" routes={testing} />
    </>
  );
};

export default Oversikt;
