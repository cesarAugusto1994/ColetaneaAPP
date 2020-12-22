import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from 'react-native-elements';

export default function AboutScreen({ navigation }) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Sobre o Minha Coletânea.</Text>
			<Text style={styles.linkText}>Este aplicativo é de produção independente, portanto não está vinculado a nenhuma instituição.</Text>
      
      <View style={styles.divider} />

      <Text style={styles.title}>Motivo</Text>
			<Text style={styles.linkText}>O Minha Coletânea foi desenvolvido para suprir a necessidade de 
        muitos instrumentistas e membros de Grupo de Louvor, para encontrarem e compartilharem materiais para ensaios particulares ou de seus respectivos grupos, 
        tendo a ideia de reunir tudo que é relevante ao louvor em um só lugar.</Text>

      <View style={styles.divider} />

      <Text style={styles.title}>Contato</Text>
			<Text style={styles.linkText}>Para contactar o desenvolvedor basta enviar um e-mail para cezzaar@gmail.com com o assunto "Minha Coletânea" e descrever sua Dúvida e/ou Sugestão no corpo do E-mail.</Text>

		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
    justifyContent: 'center',
		padding: 20,
  },
  divider: {
    marginVertical: 15
  },
	title: {
		fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
	},
	link: {
		marginTop: 15,
		paddingVertical: 15,
	},
	linkText: {
		fontSize: 15,
    color: '#333',
    alignContent: 'center'
	},
});
