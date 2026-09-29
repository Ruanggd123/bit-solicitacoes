import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (usuario: string, senha: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('bit_token');
      const storedUser = localStorage.getItem('bit_user');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          // Validação em background com o backend
          const refreshedUser = await authApi.me();
          setUser(refreshedUser);
          localStorage.setItem('bit_user', JSON.stringify(refreshedUser));
        } catch (error) {
          console.warn('Sessão expirada ao iniciar aplicação.');
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();

    // Event listener para quando o interceptor detectar 401
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (usuario: string, senha: string): Promise<void> => {
    const data = await authApi.login(usuario, senha);
    setToken(data.token);
    setUser(data.usuario);
    localStorage.setItem('bit_token', data.token);
    localStorage.setItem('bit_user', JSON.stringify(data.usuario));
  };

  const logout = () => {
    localStorage.removeItem('bit_token');
    localStorage.removeItem('bit_user');
    setUser(null);
    setToken(null);
    authApi.logout().catch(() => {});
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};
