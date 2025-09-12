export interface UserInput {
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface UserInputUpdate {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
}