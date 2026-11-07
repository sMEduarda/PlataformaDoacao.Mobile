
import * as SecureStore from 'expo-secure-store';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import api from '../services/api';
import { LoginResponse, Usuario } from '../types';

interface AuthContextData {
  user: Usuario | null;
  loading: boolean;
  signIn: (email: string, senha: string) => Promise<Usuario>;
  signOut: () => Promise<void>;
  signUp: (
    nome: string,
    email: string,
    senha: string,
    tipoUsuario: string
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  // Recupera a sessão quando o aplicativo é aberto.
  useEffect(() => {
    async function loadStorageData() {
      try {
        const storedUser = await SecureStore.getItemAsync('user');
        const storedToken = await SecureStore.getItemAsync('token');

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Erro ao recuperar sessão:', error);
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('user');
      } finally {
        setLoading(false);
      }
    }

    loadStorageData();
  }, []);

  // Realiza login.
  async function signIn(
    email: string,
    senha: string
  ): Promise<Usuario> {
    const response = await api.post<LoginResponse>(
      '/Usuarios/login',
      {
        email,
        senha,
      }
    );

    const { token, usuario } = response.data;

    if (!token || !usuario) {
      throw new Error('A API não retornou os dados necessários.');
    }

    await SecureStore.setItemAsync('token', token);

    await SecureStore.setItemAsync(
      'user',
      JSON.stringify(usuario)
    );

    setUser(usuario);

    return usuario;
  }

  // Realiza cadastro.
  async function signUp(
    nome: string,
    email: string,
    senha: string,
    tipoUsuario: string
  ) {
    await api.post('/Usuarios', {
      nome,
      email,
      senha,
      tipoUsuario,
    });
  }

  // Encerra a sessão.
  async function signOut() {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user');

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
