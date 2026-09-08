import { User } from './types';

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

export function getNameOrReturnString(
  userQuery: string,
  saksbehandler: User[]
) {
  const user = saksbehandler.find((user) => user.email === userQuery);
  if (user) {
    return user.name;
  } else {
    return userQuery;
  }

}
