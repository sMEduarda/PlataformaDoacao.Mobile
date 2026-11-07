
import { useRouter } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import cores from '../constants/cores';

export default function Home() {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudoScroll}
    >
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>
          Plataforma de Doação de Alimentos
        </Text>

        <Text style={styles.subtitulo}>
          Conectando alimentos a quem precisa
        </Text>
      </View>

      <View style={styles.conteudo}>
        <View style={styles.apresentacao}>
          <Text style={styles.heading}>
            Bem-vindo!
          </Text>

          <Text style={styles.descricao}>
            Nossa plataforma conecta estabelecimentos
            que possuem alimentos disponíveis para doação
            a instituições que precisam desses alimentos.
          </Text>

          <View style={styles.botoes}>
            <TouchableOpacity
              style={styles.botao}
              onPress={() => router.push('/login')}
              activeOpacity={0.8}
            >
              <Text style={styles.textoBotao}>
                Entrar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoSecundario}
              onPress={() => router.push('/cadastro')}
              activeOpacity={0.8}
            >
              <Text style={styles.textoBotao}>
                Cadastrar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },

  conteudoScroll: {
    flexGrow: 1,
  },

  cabecalho: {
    backgroundColor: cores.verdePrincipal,
    paddingHorizontal: 24,
    paddingTop: 65,
    paddingBottom: 35,
    alignItems: 'center',
  },

  titulo: {
    color: cores.branco,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  subtitulo: {
    color: '#e8f5e9',
    fontSize: 15,
    marginTop: 10,
    textAlign: 'center',
  },

  conteudo: {
    flex: 1,
    justifyContent: 'center',
    padding: 22,
  },

  apresentacao: {
    backgroundColor: cores.branco,
    padding: 25,
    borderRadius: 14,
    width: '100%',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },

  heading: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 14,
    color: cores.texto,
  },

  descricao: {
    fontSize: 15,
    color: cores.textoSecundario,
    lineHeight: 23,
    marginBottom: 25,
  },

  botoes: {
    gap: 13,
  },

  botao: {
    backgroundColor: cores.verdePrincipal,
    padding: 16,
    borderRadius: 9,
    alignItems: 'center',
  },

  botaoSecundario: {
    backgroundColor: cores.verdeSecundario,
    padding: 16,
    borderRadius: 9,
    alignItems: 'center',
  },

  textoBotao: {
    color: cores.branco,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
