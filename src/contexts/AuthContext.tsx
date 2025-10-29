'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { gql } from '@apollo/client';
import { apolloClient } from '@/lib/apollo-client';

interface User {
  id: string;
  email: string;
}

interface LoginResponse {
  login: {
    accessToken: string;
    refreshToken?: string;
    user: User;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Define your login mutation
const LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!) {
        login(input: {
            email: $email
            password: $password
        }) {
            accessToken
            refreshToken
            user {
                id
                email
            }
        }
    }
`;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing auth on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth-token');
      const storedUser = localStorage.getItem('auth-user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    }
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      setLoading(true);
      const { data } = await apolloClient.mutate<LoginResponse>({
        mutation: LOGIN_MUTATION,
        variables: credentials,
      });

      if (data?.login?.accessToken) {
        const authToken = data.login.accessToken;
        const refreshToken = data.login.refreshToken;
        const authUser = data.login.user;

        setToken(authToken);
        setUser(authUser);

        // Store tokens in localStorage
        localStorage.setItem('auth-token', authToken);
        if (refreshToken) {
          localStorage.setItem('refresh-token', refreshToken);
        }
        localStorage.setItem('auth-user', JSON.stringify(authUser));

        // Update Apollo Client to use the new token
        apolloClient.resetStore();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth-token');
    localStorage.removeItem('refresh-token');
    localStorage.removeItem('auth-user');
    apolloClient.clearStore();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, error: null }}>
      {children}
    </AuthContext.Provider>
  );
}
