
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'client';
  clientId?: string;
  instagramId?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
