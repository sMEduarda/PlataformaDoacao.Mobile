
import { StyleSheet, Text, View } from 'react-native';
import cores from '../constants/cores';

export default function CadastrarAlimento() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Cadastrar alimento
      </Text>

      <Text style={styles.descricao}>
        Formulário de cadastro de alimentos.
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
