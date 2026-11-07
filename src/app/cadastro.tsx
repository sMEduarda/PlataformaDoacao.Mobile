
import { useRouter } from 'expo-router';
import { useState } from 'react';

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import cores from '../constants/cores';
import { useAuth } from '../contexts/AuthContext';

export default function Cadastro() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('');

  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  async function cadastrar() {
    setErro('');
    setMensagem('');

    if (!nome.trim()) {
      setErro('Informe seu nome.');
      return;
    }

    if (!email.trim()) {
      setErro('Informe seu e-mail.');
      return;
    }

    if (senha.length < 8) {
      setErro('A senha deve ter pelo menos 8 caracteres.');
      return;
    }

    if (!tipoUsuario) {
      setErro('Selecione o tipo de usuário.');
      return;
    }

    try {
      setEnviando(true);

      await signUp(
        nome.trim(),
        email.trim(),
        senha,
        tipoUsuario
      );

      setMensagem('Usuário cadastrado com sucesso!');

      setNome('');
      setEmail('');
      setSenha('');
      setTipoUsuario('');

    } catch (error: any) {
      console.error('ERRO NO CADASTRO:', error);

      if (error.response?.status === 409) {
        setErro('Este e-mail já está cadastrado.');
      } else if (error.response?.status === 400) {
        setErro('Verifique os dados informados.');
      } else {
        setErro(
          'Não foi possível realizar o cadastro. Verifique se a API está rodando.'
        );
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>

          <Text style={styles.titulo}>
            Criar conta
          </Text>

          <Text style={styles.subtitulo}>
            Cadastre-se na Plataforma de Doação
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Nome"
            placeholderTextColor="#888"
            value={nome}
            onChangeText={setNome}
            maxLength={100}
          />

          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            maxLength={150}
          />

          <TextInput
            style={styles.input}
            placeholder="Senha (mínimo de 8 caracteres)"
            placeholderTextColor="#888"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          <Text style={styles.label}>
            Tipo de usuário
          </Text>

          <View style={styles.tipoContainer}>

            <TouchableOpacity
              style={[
                styles.tipoBotao,
                tipoUsuario === 'estabelecimento' &&
                  styles.tipoAtivo,
              ]}
              onPress={() => setTipoUsuario('estabelecimento')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tipoTexto,
                  tipoUsuario === 'estabelecimento' &&
                    styles.tipoTextoAtivo,
                ]}
              >
                Estabelecimento
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tipoBotao,
                tipoUsuario === 'instituicao' &&
                  styles.tipoAtivo,
              ]}
              onPress={() => setTipoUsuario('instituicao')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tipoTexto,
                  tipoUsuario === 'instituicao' &&
                    styles.tipoTextoAtivo,
                ]}
              >
                Instituição
              </Text>
            </TouchableOpacity>

          </View>

          {erro ? (
            <Text style={styles.erro}>
              {erro}
            </Text>
          ) : null}

          {mensagem ? (
            <Text style={styles.sucesso}>
              {mensagem}
            </Text>
          ) : null}

          <TouchableOpacity
            style={[
              styles.botao,
              enviando && styles.botaoDesabilitado,
            ]}
            onPress={cadastrar}
            disabled={enviando}
            activeOpacity={0.8}
          >
            {enviando ? (
              <ActivityIndicator color={cores.branco} />
            ) : (
              <Text style={styles.textoBotao}>
                Cadastrar
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoVoltar}
            onPress={() => router.replace('/login')}
            activeOpacity={0.8}
          >
            <Text style={styles.textoVoltar}>
              Voltar para o login
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },

  conteudo: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 22,
  },

  card: {
    backgroundColor: cores.branco,
    padding: 25,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },

  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: cores.texto,
    marginBottom: 7,
  },

  subtitulo: {
    fontSize: 14,
    color: cores.textoSecundario,
    marginBottom: 25,
    lineHeight: 21,
  },

  input: {
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: 15,
    borderRadius: 9,
    marginBottom: 14,
    fontSize: 15,
    color: cores.texto,
  },

  label: {
    fontSize: 14,
    color: cores.textoSecundario,
    marginBottom: 10,
    fontWeight: '600',
  },

  tipoContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },

  tipoBotao: {
    flex: 1,
    paddingVertical: 13,
    paddingHorizontal: 6,
    borderWidth: 1.5,
    borderColor: cores.verdePrincipal,
    borderRadius: 9,
    alignItems: 'center',
  },

  tipoAtivo: {
    backgroundColor: cores.verdePrincipal,
  },

  tipoTexto: {
    color: cores.verdePrincipal,
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  tipoTextoAtivo: {
    color: cores.branco,
  },

  erro: {
    color: cores.erro,
    fontSize: 14,
    marginBottom: 15,
    lineHeight: 20,
  },

  sucesso: {
    color: cores.sucesso,
    fontSize: 14,
    marginBottom: 15,
    lineHeight: 20,
  },

  botao: {
    backgroundColor: cores.verdePrincipal,
    padding: 16,
    borderRadius: 9,
    alignItems: 'center',
    marginBottom: 12,
  },

  botaoDesabilitado: {
    opacity: 0.7,
  },

  textoBotao: {
    color: cores.branco,
    fontSize: 16,
    fontWeight: 'bold',
  },

  botaoVoltar: {
    padding: 12,
    alignItems: 'center',
  },

  textoVoltar: {
    color: cores.verdePrincipal,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
