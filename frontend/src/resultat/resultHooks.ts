import { useLocation } from 'react-router';

export const useGetCurrentPath =() => {
  const location = useLocation();

  return location.pathname.split('/').pop() ?? 'resultat';
}
