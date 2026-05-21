export interface User {
  id: string;
  name: string;
  email: string;
  role: "MEMBER" | "MANAGER" | "ADMIN";
  createdAt: string;
}

export interface AuthResponse {
  status: string;
  data: {
    token: string;
    user: User;
  };
}

export interface LoginPayload {
  email: string;
  password: Record<string, any> | string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: Record<string, any> | string;
  role: string;
}
