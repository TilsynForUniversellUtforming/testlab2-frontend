export type Role = 'advisor';

export type User = {
  id: number;
  name: string;
  email: string;
  roles: Role[];
};
