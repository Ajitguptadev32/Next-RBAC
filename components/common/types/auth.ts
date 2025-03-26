// types/auth.ts
export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: "admin" | "manager" | "user";
}

export interface AuthResponse {
  message: string;
  user: User;
  token?: string;
}
