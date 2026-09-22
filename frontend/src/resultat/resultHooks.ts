import { useLocation } from 'react-router';

export const useGetCurrentPath =() => {
  const location = useLocation();

  const tab = location.pathname.split('/').pop();
  if (tab === 'tema' || tab === 'krav') {
    return tab;
  }
  return 'resultat';
}
