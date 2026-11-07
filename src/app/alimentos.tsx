
import { StyleSheet, Text, View } from 'react-native';
import cores from '../constants/cores';

export default function Alimentos() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Alimentos disponíveis
      </Text>

      <Text style={styles.descricao}>
        Confira os alimentos disponíveis para doação.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: cores.verdePrincipal,
    marginBottom: 12,
  },

  descricao: {
    fontSize: 15,
    color: cores.textoSecundario,
    textAlign: 'center',
  },
});
