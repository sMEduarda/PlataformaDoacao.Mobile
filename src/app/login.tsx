
import { useRouter } from 'expo-router';
import { useState } from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  async function entrar() {
    setErro('');

    if (!email.trim() || !senha) {
      setErro('Preencha todos os campos.');
      return;
    }

    try {
      setEnviando(true);

      const usuario = await signIn(
        email.trim(),
        senha
      );

      const tipo = String(
        (usuario as any).tipoUsuario ??
        (usuario as any).TipoUsuario ??
        ''
      ).toLowerCase();

      setSenha('');

      if (tipo === 'estabelecimento') {
        router.replace('/solicitacoes');
      } else if (tipo === 'instituicao') {
        router.replace('/alimentos');
      } else {
        await useAuth;
        router.replace('/');
      }

    } catch (error: any) {
      console.log(
        'ERRO NO LOGIN:',
        error.response?.data || error.message
      );

      if (error.response?.status === 401) {
        setErro('E-mail ou senha inválidos.');
      } else {
        setErro(
          'Não foi possível entrar. Verifique se a API está rodando.'
        );
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>

        <Text style={styles.title}>Entrar</Text>

        <Text style={styles.subtitle}>
          Acesse sua conta na Plataforma de Doação
        </Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#888"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        {erro ? (
          <Text style={styles.errorText}>
            {erro}
          </Text>
        ) : null}

        <TouchableOpacity
          style={[
            styles.button,
            enviando && styles.buttonDisabled,
          ]}
          onPress={entrar}
          disabled={enviando}
        >
          {enviando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          )}
        </TouchableOpacity>

        <Text style={styles.linkText}>
          Ainda não possui uma conta?
        </Text>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('/cadastro')}
        >
          <Text style={styles.secondaryButtonText}>
            Cadastre-se
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    padding: 20,
  },

  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 8,
    elevation: 3,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },

  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },

  errorText: {
    color: '#b91c1c',
    marginBottom: 12,
    fontSize: 14,
  },

  button: {
    backgroundColor: '#2e7d32',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 16,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  linkText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 8,
    fontSize: 14,
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: '#2e7d32',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },

  secondaryButtonText: {
    color: '#2e7d32',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
