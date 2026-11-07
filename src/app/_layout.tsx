
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

import {
  ActivityIndicator,
  View,
} from 'react-native';

import {
  AuthProvider,
  useAuth,
} from '../contexts/AuthContext';

function RootLayoutNav() {
  const { user, loading } = useAuth();

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const rotaAtual = segments[0];

    const rotasPublicas = [
      'index',
      'login',
      'cadastro',
    ];

    const estaEmRotaPublica =
      rotasPublicas.includes(rotaAtual);

    const estaNaAutenticacao =
      rotaAtual === 'login' ||
      rotaAtual === 'cadastro';

    // Usuário sem login pode acessar Home, Login e Cadastro.
    if (!user && !estaEmRotaPublica) {
      router.replace('/login');
      return;
    }

    // Se já estiver autenticado, não precisa entrar novamente.
    if (user && estaNaAutenticacao) {
      const tipo = String(
        (user as any).tipoUsuario ??
        (user as any).TipoUsuario ??
        ''
      ).toLowerCase();

      if (tipo === 'estabelecimento') {
        router.replace('/solicitacoes');
      } else if (tipo === 'instituicao') {
        router.replace('/alimentos');
      } else {
        router.replace('/');
      }
    }
  }, [user, loading, segments, router]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f9f9f9',
        }}
      >
        <ActivityIndicator
          size="large"
          color="#2e7d32"
        />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: '#f9f9f9',
        },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="cadastro" />
      <Stack.Screen name="alimentos" />
      <Stack.Screen name="cadastrar-alimento" />
      <Stack.Screen name="solicitacoes" />
      <Stack.Screen name="explore" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
