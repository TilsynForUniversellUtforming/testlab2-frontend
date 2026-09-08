import { useQuery } from '@tanstack/react-query';
import { fetchWithErrorHandling } from '@common/form/util';
import { User } from './types';

const SAKSBEHANDLER_QUERY_KEY = ['saksbehandler'] as const;

const fetchSaksbehandler = async (): Promise<User[]> => {
  const response = await fetchWithErrorHandling(`/api/v1/users`);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data: Array<{ id: number; namn: string; brukarnamn: string }> =
    await response.json();

  return data.map((user) => ({
    id: user.id,
    name: user.namn,
    email: user.brukarnamn,
    roles: ['advisor'],
  }));
};

const useFetchSaksbehandler = () => {
  const {
    data: saksbehandler = [],
    isLoading: loading,
    error,
  } = useQuery<User[], Error>({
    queryKey: SAKSBEHANDLER_QUERY_KEY,
    queryFn: fetchSaksbehandler,
  });

  return { saksbehandler, loading, error };
};

export default useFetchSaksbehandler;