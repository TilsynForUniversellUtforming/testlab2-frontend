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
