// types/auth.ts
export interface User {
  _id: string; // Add this
  fullName: string;
  email: string;
  role: "admin" | "manager" | "user";
  createdAt?: string; // Optional, if present
  updatedAt?: string; // Optional, if present
}

export interface AuthResponse {
  message: string;
  user: User;
}
