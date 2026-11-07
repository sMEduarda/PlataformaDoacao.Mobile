import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState<'estabelecimento' | 'instituicao'>('instituicao');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  async function handleCadastro() {
    if (!nome || !email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    if (senha.length < 8) {
      Alert.alert('Erro', 'A senha deve ter no mínimo 8 caracteres.');
      return;
    }

    try {
      setLoading(true);
      await signUp(nome.trim(), email.trim().toLowerCase(), senha, tipoUsuario);
      Alert.alert('Sucesso', 'Cadastro realizado! Faça login.', [
        { text: 'OK', onPress: () => router.replace('/login') },
      ]);
    } catch (error: any) {
    console.log('Erro completo:', error);
    console.log('Resposta da API:', error.response?.data);
    console.log('Status:', error.response?.status);

    let mensagem = 'Não foi possível cadastrar.';

    if (error.response?.data) {
        mensagem = typeof error.response.data === 'string'
        ? error.response.data
        : JSON.stringify(error.response.data);
    } else if (error.message) {
        mensagem = error.message;
    }

    Alert.alert('Erro no cadastro', mensagem);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        placeholderTextColor="#999"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha (mínimo 8 caracteres)"
        placeholderTextColor="#999"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <Text style={styles.label}>Tipo de conta:</Text>

      <View style={styles.tipoContainer}>
        <TouchableOpacity
          style={[
            styles.tipoButton,
            tipoUsuario === 'instituicao' && styles.tipoButtonActive,
          ]}
          onPress={() => setTipoUsuario('instituicao')}
        >
          <Text
            style={[
              styles.tipoText,
              tipoUsuario === 'instituicao' && styles.tipoTextActive,
            ]}
          >
            Instituição
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tipoButton,
            tipoUsuario === 'estabelecimento' && styles.tipoButtonActive,
          ]}
          onPress={() => setTipoUsuario('estabelecimento')}
        >
          <Text
            style={[
              styles.tipoText,
              tipoUsuario === 'estabelecimento' && styles.tipoTextActive,
            ]}
          >
            Estabelecimento
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleCadastro}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Cadastrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Já tem conta? Fazer login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a73e8',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  label: {
    fontSize: 15,
    color: '#555',
    marginBottom: 10,
  },
  tipoContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  tipoButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  tipoButtonActive: {
    backgroundColor: '#1a73e8',
    borderColor: '#1a73e8',
  },
  tipoText: {
    fontSize: 14,
    color: '#555',
  },
  tipoTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#1a73e8',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 24,
    textAlign: 'center',
    color: '#1a73e8',
    fontSize: 15,
  },
});