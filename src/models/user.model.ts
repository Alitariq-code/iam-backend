export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at?: Date;
}
