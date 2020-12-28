import * as React from 'react';
import { StyleSheet, Alert, View, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import { Block, Text } from 'galio-framework';
import { getUser, getToken } from '../services/services/auth';
import api from '../services/api/axios';
import { sendPushNotification } from '../utils/pushNotifications'

export default function UserEditScreen({ navigation }) {

	const [currentUser, setCurrentUser] = React.useState(null);

	const [saving, setSaving] = React.useState(false);
	const [message, setMessage] = React.useState('');

	const getCurrentUser = async () => {
		const parseUser = await getUser();
		setCurrentUser(JSON.parse(parseUser));
	};

	React.useEffect(() => {
		getCurrentUser();
	}, []);

	const sendMessage = async () => {
		try {

			if(!message) {
				Alert.alert('Campo Requerido', 'Por favor infromar a mensagem da sugestão ou erro');
				return
			}

			const response = await api.post(
				`sugestoes`,
				{
					texto: message,
					user: currentUser.id
				},
				{
					headers: {
						Authorization: await getToken(),
					},
				}
			);
			if (response) {
				Alert.alert('Sucesso', 'Sugestão enviada com sucesso, agradecemos seu feedback.');

				await sendPushNotification("ExponentPushToken[I604FELYvl-hFnzLmReXbo]", {
					title: "Nova Sugestão Adicionada",
					body: `${currentUser.name}: ${message}`
				})

				setSaving(false)
				navigation.goBack()
			}
		} catch (error) {
			setSaving(false)
			console.log('error', error.response);
		}
	};

	return (
		<View style={styles.container}>
			{currentUser &&
				<Block flex>

					<Block style={styles.blockText}>
						<Text style={styles.linkText}>Descreva a Sugestão ou Erro</Text>
						<TextInput
							style={styles.textInput}
							placeholder="Insira aqui a sua mensagem"
							onChangeText={text => setMessage(text)}
							multiline={true}
							numberOfLines={10}
							scrollEnabled
						/>
					</Block>

					<View style={styles.divider} />

					<Block>
						<Button title="Enviar" onPress={sendMessage} loading={saving} />
					</Block>

					<View style={styles.divider} />
				</Block>}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		padding: 20,
	},
	blockText: {
		height: '40%'
	},
	textInput: {
		width: '100%',
		backgroundColor: '#f5f5f5',
		padding: 10,
	},
	divider: {
		marginVertical: 10,
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
		color: '#595858',
		alignContent: 'center',
	},
});
