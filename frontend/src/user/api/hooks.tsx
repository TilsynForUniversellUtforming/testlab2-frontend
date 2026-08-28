import { useEffect, useState } from 'react';
import { fetchWithErrorHandling } from '@common/form/util';
import { User } from './types';

const useFetchSaksbehandler = () => {
  const [saksbehandler, setSaksbehandler] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSaksbehandler = async () => {
      try {
        const response = await fetchWithErrorHandling(
          `/api/v1/users`
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        const saksbehandlerList: User[] = data.map((user: any) => ({
          id: user.id,
          name: user.namn,
          email: user.brukarnamn,
        }));
        setSaksbehandler(saksbehandlerList);
      } catch (error) {
        console.error(error);
        // @ts-ignore
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSaksbehandler();
  }, []);

  return { saksbehandler, loading, error };
}

export default useFetchSaksbehandler;