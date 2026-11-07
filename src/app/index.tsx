import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Alimento } from '../types';

export default function Home() {
  const { user, signOut } = useAuth();
  const [alimentos, setAlimentos] = useState<Alimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  async function carregarAlimentos() {
    try {
      const response = await api.get<Alimento[]>('/Alimentos');
      setAlimentos(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setAlimentos([]);
      } else {
        Alert.alert('Erro', 'Não foi possível carregar os alimentos.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    carregarAlimentos();
  }, []);

  function onRefresh() {
    setRefreshing(true);
    carregarAlimentos();
  }

  async function handleLogout() {
    await signOut();
    router.replace('/login');
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {user?.nome}</Text>
          <Text style={styles.tipo}>
            {user?.tipoUsuario === 'estabelecimento'
              ? 'Estabelecimento'
              : 'Instituição'}
          </Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Sair</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Alimentos Disponíveis</Text>

      {alimentos.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.empty}>Nenhum alimento disponível no momento.</Text>
        </View>
      ) : (
        <FlatList
          data={alimentos}
          keyExtractor={(item) => String(item.idAlimento)}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.tipoAlimento}</Text>
              <Text style={styles.cardInfo}>
                Quantidade: {item.quantidade} {item.unidade}
              </Text>
              <Text style={styles.cardInfo}>
                Validade: {new Date(item.dataValidade).toLocaleDateString('pt-BR')}
              </Text>

              {user?.tipoUsuario === 'instituicao' && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() =>
                    Alert.alert(
                      'Solicitar doação',
                      `Deseja solicitar ${item.tipoAlimento}?`,
                      [
                        { text: 'Cancelar', style: 'cancel' },
                        {
                          text: 'Solicitar',
                          onPress: () => solicitarDoacao(item),
                        },
                      ]
                    )
                  }
                >
                  <Text style={styles.buttonText}>Solicitar</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
    </View>
  );

  async function solicitarDoacao(alimento: Alimento) {
    try {
      await api.post('/Solicitacoes', {
        idAlimento: alimento.idAlimento,
        quantidadeSolicitada: alimento.quantidade, // por enquanto pede tudo
      });
      Alert.alert('Sucesso', 'Solicitação enviada!');
      carregarAlimentos();
    } catch (error: any) {
      const msg = error.response?.data || 'Erro ao solicitar doação.';
      Alert.alert('Erro', String(msg));
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  tipo: {
    fontSize: 13,
    color: '#666',
  },
  logout: {
    color: '#e53935',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1a73e8',
  },
  empty: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  cardInfo: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  button: {
    marginTop: 12,
    backgroundColor: '#1a73e8',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});