import { Address } from "./address";

export interface Customer {
  id: string;
  username: string;
  email: string;
  password: string;
  name: string;
  lastname: string;
  address?: Address;
  created_at?: Date;
  updated_at?: Date;
  emailVerified?: Date;
}
