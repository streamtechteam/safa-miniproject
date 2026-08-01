export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  username: string;
  password: string;
}

export type UserRole = 'sys-admin' | 'technician ';
