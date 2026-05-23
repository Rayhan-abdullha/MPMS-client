export interface Team {
  id: string;
  name: string;
  email: string;
  role: "MEMBER" | "MANAGER" | "ADMIN";
  isActive: boolean;
  department: string;
  avatar: string;
  createdAt: string;
}
