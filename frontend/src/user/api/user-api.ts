import { User } from './types';
import { useEffect } from 'react';
import useFetchSaksbehandler from './hooks';

const dummyResponse: User[] = [
  {
    id: 1,
    name: 'Ola Nordmann',
    email: 'test@digdir.no',
    roles: ['advisor'],
  },
  {
    id: 2,
    name: 'Kari Nordmann',
    email: 'test2@digdir.no',
    roles: ['advisor'],
  },
];

export const getAdvisors_dummy = async (): Promise<User[]> => {
  return dummyResponse;
};

export function getNameOrReturnString(userQuery:String) {
  const {saksbehandler} = useFetchSaksbehandler();

  const user = saksbehandler.find((user) => user.email === userQuery);
  if(user) {
    return user.name;
  } else {
    return userQuery;
  }

}
