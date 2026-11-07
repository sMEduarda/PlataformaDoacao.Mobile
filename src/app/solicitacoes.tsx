import { useFocusEffect, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import api from '../services/api';

export default function Solicitacoes() {
  const router = useRouter();

  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [processando, setProcessando] = useState(null);

  // Remove a sessão inválida e redireciona para o login
  async function encerrarSessao() {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('usuario');
    router.replace('/login');
  }

  async function buscarSolicitacoes() {
    try {
      setErro('');
      setCarregando(true);

      const resposta = await api.get('/api/Solicitacoes');
      setSolicitacoes(resposta.data);
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 401) {
        encerrarSessao();
        return;
      }
      if (error.response?.status === 403) {
        setErro('Apenas estabelecimentos podem gerenciar solicitações.');
        return;
      }
      setErro('Não foi possível carregar as solicitações. Verifique se a API está rodando.');
    } finally {
      setCarregando(false);
    }
  }

  // Atualiza a lista sempre que a tela entra em foco
  useFocusEffect(
    useCallback(() => {
      buscarSolicitacoes();
    }, [])
  );

  async function responderSolicitacao(id, acao) {
    Alert.alert(
      'Confirmação',
      `Deseja realmente ${acao} esta solicitação?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim',
          onPress: async () => {
            try {
              setProcessando(id);

              await api.put(`/api/Solicitacoes/${id}/${acao}`);

              Alert.alert(
                'Sucesso',
                acao === 'aprovar' ? 'Solicitação aprovada com sucesso!' : 'Solicitação recusada com sucesso!'
              );

              await buscarSolicitacoes();
            } catch (error: any) {
              console.error(error);
              if (error.response?.status === 401) {
                encerrarSessao();
                return;
              }
              const mensagem = error.response?.data || 'Erro ao atualizar solicitação.';
              Alert.alert('Erro', typeof mensagem === 'string' ? mensagem : 'Não foi possível concluir a operação.');
            } finally {
              setProcessando(null);
            }
          },
        },
      ]
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Gerenciar solicitações</Text>
        <Text style={styles.subtitulo}>Visualize e responda aos pedidos de doação.</Text>
      </View>

      {carregando && (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color="#2e7d32" />
          <Text style={styles.textoCentral}>Carregando solicitações...</Text>
        </View>
      )}

      {erro ? <Text style={styles.erroTexto}>{erro}</Text> : null}

      {!carregando && !erro && solicitacoes.length === 0 && (
        <View style={styles.centro}>
          <Text style={styles.textoCentral}>Nenhuma solicitação recebida.</Text>
        </View>
      )}

      {!carregando && !erro && (
        <View style={styles.lista}>
          {solicitacoes.map((solicitacao: any) => (
            <View style={styles.card} key={solicitacao.idSolicitacao}>
              <Text style={styles.cardTitulo}>
                {solicitacao.idAlimentoNavigation?.tipoAlimento || 'Alimento não informado'}
              </Text>

              <Text style={styles.cardTexto}>
                <Text style={styles.negrito}>Solicitação:</Text> #{solicitacao.idSolicitacao}
              </Text>

              <Text style={styles.cardTexto}>
                <Text style={styles.negrito}>Instituição:</Text>{' '}
                {solicitacao.idInstituicaoNavigation?.nomeInstituicao || 'Instituição não informada'}
              </Text>

              <Text style={styles.cardTexto}>
                <Text style={styles.negrito}>Quantidade solicitada:</Text> {solicitacao.quantidadeSolicitada}{' '}
                {solicitacao.idAlimentoNavigation?.unidade || ''}
              </Text>

              <Text style={styles.cardTexto}>
                <Text style={styles.negrito}>Status:</Text> {solicitacao.statusSolicitacao}
              </Text>

              {solicitacao.statusSolicitacao === 'SOLICITADA' && (
                <View style={styles.botoesAcao}>
                  <TouchableOpacity
                    style={[styles.botao, styles.botaoAprovar]}
                    disabled={processando !== null}
                    onPress={() => responderSolicitacao(solicitacao.idSolicitacao, 'aprovar')}
                  >
                    <Text style={styles.textoBotao}>
                      {processando === solicitacao.idSolicitacao ? 'Processando...' : 'Aprovar'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.botao, styles.botaoRecusar]}
                    disabled={processando !== null}
                    onPress={() => responderSolicitacao(solicitacao.idSolicitacao, 'recusar')}
                  >
                    <Text style={styles.textoBotao}>Recusar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#f9f9f9', padding: 16 },
  cabecalho: { marginBottom: 20, marginTop: 20 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#2e7d32', textAlign: 'center' },
  subtitulo: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 4 },
  centro: { padding: 40, alignItems: 'center' },
  textoCentral: { textAlign: 'center', color: '#666', marginTop: 10, fontSize: 16 },
  erroTexto: { textAlign: 'center', color: '#b91c1c', marginBottom: 12, fontSize: 14 },
  lista: { gap: 12 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, elevation: 2, marginBottom: 12 },
  cardTitulo: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  cardTexto: { fontSize: 14, color: '#444', marginBottom: 4 },
  negrito: { fontWeight: 'bold' },
  botoesAcao: { flexDirection: 'row', gap: 10, marginTop: 12 },
  botao: { flex: 1, padding: 12, borderRadius: 6, alignItems: 'center' },
  botaoAprovar: { backgroundColor: '#2e7d32' },
  botaoRecusar: { backgroundColor: '#b91c1c' },
  textoBotao: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
});