import * as React from 'react';
import { StyleSheet, Text, Alert, Dimensions, View, ImageBackground } from 'react-native';
import { Card, Divider } from 'react-native-elements';
import api from '../services/api/axios';
import { onSignIn } from '../services/services/auth';
import { Block, theme } from 'galio-framework';
import { Button, Input, Icon } from '../components/galio';
import { argonTheme } from '../components/constants/';

const { width } = Dimensions.get('screen');

const image = require('../assets/images/splash-9.png');

export default function NotFoundScreen({ navigation }) {

	const [name, setName] = React.useState('');
	const [username, setUsername] = React.useState('');
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [passwordRepeat, setPasswordRepeat] = React.useState('');
	const [loginView, setloginView] = React.useState(true);
	const [saving, setSaving] = React.useState(false);

	const handleLoginView = () => {
		setloginView(!loginView);
	};

	const verifyCreateLogin = async () => {
		try {
			if (!name) {
				Alert.alert('Nome Requerido!', 'Informe o seu nome completo.');
				return;
			}

			if (!username) {
				Alert.alert('Nome de Usuário Requerido!', 'Informe o nome de usuário');
				return;
			}

			if (!email) {
				Alert.alert('E-mail requerido!', 'O email deve ser informado!');
				return;
			}

			if (!password) {
				Alert.alert('Senha Requerida', 'A senha deve ser informada!');
				return;
			}

			if (!passwordRepeat) {
				Alert.alert('Repita a Senha', 'Repita a senha informada acima.');
				return;
			}

			if (password !== passwordRepeat) {
				Alert.alert('Verificação da Senha', 'A senha informada não é a mesma nos campos de senha');
				return;
			}

			setSaving(true);

			const response = await api.post(
				'auth/local/register',
				{ email, name, username, password },
				{
					data: { email, username, name, password, role: 'reader' },
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			if (response) {
				setSaving(false);
				if (response.data) {
					if (response.data.jwt) {
						alert('Usuário Cadastrado com sucesso!');
						verifyLogin();
					}
				} else {
					alert('Ocorreu um erro inesperado.');
				}
			}
		} catch (error) {
			setSaving(false);
			if (error.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx

				if (error.response.data) {
					const messages = error.response.data.data;

					if (Array.isArray(messages)) {
						const firstMessage = messages;

						if (Array.isArray(firstMessage)) {
							const data = firstMessage[0].messages;

							if (Array.isArray(data)) {

								if(data[0].message === 'Email is already taken.') {
									Alert.alert("Acesso Negado", "E-mail já cadastrado.");
									return
								}

								if(data[0].message === 'Username already taken') {
									Alert.alert("Acesso Negado", "Nome de Usuário já cadastrado.");
									return
								}
								
								Alert.alert("Erro Inesperado", data[0].message);
							}
						}
					}

					// alert(error.response.data.data.messages)
				}

				// console.log(error.response.data);
				// console.log(error.response.status);
				// console.log(error.response.headers);
			} else if (error.request) {
				// The request was made but no response was received
				// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
				// http.ClientRequest in node.js
				// console.log(error.request);
			} else {
				// Something happened in setting up the request that triggered an Error
				// console.log('Error', error.message);
			}
			// console.log(error.config);
		}
	};

	const clearState = () => {
		setName('')
		setUsername('')
		setEmail('')
		setPassword('')
		setPasswordRepeat('')
	}

	const verifyLogin = async () => {
		try {
			
			if (!email) {
				Alert.alert("Requerido!", 'O email ou usuário deve ser informado!');
				return;
			}

			if (!password) {
				Alert.alert("Requerido!", 'A senha deve ser informada!');
				return;
			}

			setSaving(true);

			const response = await api.post(
				'auth/local',
				{ identifier: email, password },
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			if (response) {
				setSaving(false);
				if (response.data) {
					onSignIn(response.data).then(async () => {
						navigation.navigate('Root');
					});
				} else {
					Alert.alert('Registrado Com Sucesso');
				}
			}
		} catch (error) {
			setSaving(false);
			if (error.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx

				if (error.response.data) {
					const messages = error.response.data.data;

					if (Array.isArray(messages)) {
						const firstMessage = messages;

						if (Array.isArray(firstMessage)) {
							const data = firstMessage[0].messages;

							if (Array.isArray(data)) {

								if(data[0].message === 'Identifier or password invalid.') {
									Alert.alert("Acesso Negado", "Usuário ou Senha são Inválidos.");
									return
								}

								Alert.alert("Acesso Negado", data[0].message);

							}
						}
					}

					// alert(error.response.data.data.messages)
				}

				// console.log(error.response.data);
				// console.log(error.response.status);
				// console.log(error.response.headers);
			} else if (error.request) {
				// The request was made but no response was received
				// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
				// http.ClientRequest in node.js
				// console.log(error.request);
			} else {
				// Something happened in setting up the request that triggered an Error
				// console.log('Error', error.message);
			}
			// console.log(error.config);
		}
	};

	return (
		<ImageBackground source={image} style={styles.image}>
			<View style={styles.container}>
				<Text style={styles.title}>Minha Coletânea</Text>
				{loginView
					? <Card containerStyle={{ width: '100%', borderWidth: 0 }} wrapperStyle={{ borderWidth: 0 }}>
							<Card.Title>LOGIN</Card.Title>

							<Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
								<Input
									placeholder="E-mail ou usuário"
									style={styles.inputStyle}
									iconContent={
										<Icon
											size={11}
											style={{ marginRight: 10 }}
											color={argonTheme.COLORS.ICON}
											name="ic_mail_24px"
											family="ArgonExtra"
										/>
									}
									onChangeText={text => setEmail(text)}
								/>
							</Block>

							<Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
								<Input
									password
									viewPass
									placeholder="Senha"
									style={styles.inputStyle}
									viewPass
									iconContent={
										<Icon
											size={11}
											style={{ marginRight: 10 }}
											color={argonTheme.COLORS.ICON}
											name="padlock-unlocked"
											family="ArgonExtra"
										/>
									}
									onChangeText={text => setPassword(text)}
								/>
							</Block>

							<Divider style={{ marginVertical: 20 }} />

							<Block center>
								<Button
									color="success"
									style={styles.button}
									onPress={() => {
										verifyLogin();
									}}
									loading={saving}
								>
									Entrar
								</Button>
							</Block>
							<Block center>
								<Text>ou</Text>
							</Block>
							<Block center style={{ marginTop: 8 }}>
								<Button
									color="primary"
									textStyle={{ fontSize: 12 }}
									style={styles.button}
									onPress={() => {
										handleLoginView();
										clearState()
									}}
								>
									Registrar-se
								</Button>
							</Block>
						</Card>
					: <Card containerStyle={{ width: '100%' }}>
							<Card.Title>REGISTRAR-SE</Card.Title>

							<Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
								<Input
									placeholder="Nome Completo"
									style={styles.inputStyle}
									iconContent={
										<Icon
											size={11}
											style={{ marginRight: 10 }}
											color={argonTheme.COLORS.ICON}
											name="g-check"
											family="ArgonExtra"
										/>
									}
									onChangeText={text => setName(text)}
								/>
							</Block>

							<Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
								<Input
									placeholder="Nome de Usuário (Ex: carlos.gomes)"
									style={styles.inputStyle}
									type="email-address"
									iconContent={
										<Icon
											size={11}
											style={{ marginRight: 10 }}
											color={argonTheme.COLORS.ICON}
											name="g-check"
											family="ArgonExtra"
										/>
									}
									onChangeText={text => setUsername(text)}
								/>
							</Block>

							<Divider style={{ marginVertical: 20 }} />

							<Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
								<Input
									placeholder="E-mail"
									style={styles.inputStyle}
									iconContent={
										<Icon
											size={11}
											style={{ marginRight: 10 }}
											color={argonTheme.COLORS.ICON}
											name="ic_mail_24px"
											family="ArgonExtra"
										/>
									}
									onChangeText={text => setEmail(text)}
								/>
							</Block>

							<Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
								<Input
									password
									placeholder="Senha"
									viewPass
									style={styles.inputStyle}
									iconContent={
										<Icon
											size={11}
											style={{ marginRight: 10 }}
											color={argonTheme.COLORS.ICON}
											name="padlock-unlocked"
											family="ArgonExtra"
										/>
									}
									onChangeText={text => setPassword(text)}
								/>
							</Block>

							<Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
								<Input
									password
									viewPass
									placeholder="Repita a senha"
									style={styles.inputStyle}
									iconContent={
										<Icon
											size={11}
											style={{ marginRight: 10 }}
											color={argonTheme.COLORS.ICON}
											name="padlock-unlocked"
											family="ArgonExtra"
										/>
									}
									onChangeText={text => setPasswordRepeat(text)}
								/>
							</Block>

							<Divider style={{ marginVertical: 20 }} />

							<Block center>
								<Button
									color="success"
									style={styles.button}
									onPress={() => {
										verifyCreateLogin();
									}}
								>
									Salvar
								</Button>
							</Block>
							<Block center>
								<Text>ou</Text>
							</Block>
							<Block center style={{ marginTop: 8 }}>
								<Button
									color="primary"
									textStyle={{ fontSize: 12 }}
									style={styles.button}
									onPress={() => {
										handleLoginView();
										clearState()
									}}
								>
									Voltar ao login
								</Button>
							</Block>
						</Card>}
			</View>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// backgroundColor: '#f5f5f5',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
	},
	image: {
		flex: 1,
		resizeMode: 'cover',
		justifyContent: 'center',
	},
	button: {
		marginBottom: theme.SIZES.BASE,
		width: width - theme.SIZES.BASE * 6,
	},
	inputStyle: {
		borderWidth: 0,
		backgroundColor: '#f5f5f5',
	},
	title: {
		fontSize: 30,
		fontWeight: 'bold',
		color: '#f5f5f5',
		marginBottom: 20,
	},
	link: {
		marginTop: 15,
		paddingVertical: 15,
		backgroundColor: '#FFF',
		alignItems: 'center',
		width: '100%',
	},
	linkText: {
		fontSize: 15,
		color: '#d44b42',
	},
});
