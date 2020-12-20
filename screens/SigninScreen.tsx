import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet, Text, TextInput, Dimensions, View } from 'react-native';
import { Card, Divider } from 'react-native-elements';
import api from '../services/api/axios';
import { onSignIn } from '../services/services/auth';
import { Block, theme } from 'galio-framework';
import { Button, Input, Icon } from '../components/galio';
import { argonTheme } from '../components/constants/';

const { width } = Dimensions.get('screen');

export default function NotFoundScreen({ navigation }) {
	const [username, setUsername] = React.useState('');
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [loginView, setloginView] = React.useState(true);

	const handleLoginView = () => {
		setloginView(!loginView);
	};

	const verifyCreateLogin = async () => {
		try {
			if (!email) {
				alert('O email deve ser informado!');
				return;
			}

			if (!password) {
				alert('A senha deve ser informada!');
				return;
			}

			const response = await api.post(
				'auth/local/register',
				{ email, username, password },
				{
					data: { email, username, password, role: 'reader' },
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			if (response) {
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
								alert(data[0].message);
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

	const verifyLogin = async () => {
		try {
			if (!email) {
				alert('O email deve ser informado!');
				return;
			}

			if (!password) {
				alert('A senha deve ser informada!');
				return;
			}

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
				if (response.data) {
					onSignIn(response.data).then(async () => {
						navigation.navigate('Root');
					});
				} else {
					alert('Registrado Com Sucesso');
				}
			}
		} catch (error) {
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
								alert(data[0].message);
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
		<View style={styles.container}>
			<Text style={styles.title}>Minha Coletânea</Text>

			{loginView
				? <Card containerStyle={{ width: '100%' }}>
						<Card.Title>Login</Card.Title>

						<Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
							<Input
								placeholder="Digite seu e-mail"
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
								secureTextEntry
								placeholder="Digite sua senha"
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
								color="red"
								style={styles.button}
								onPress={() => {
									verifyLogin();
								}}
							>
								Entrar
							</Button>
						</Block>
						<Block center>
							<Button
								color="secondary"
								textStyle={{ color: 'black', fontSize: 12, fontWeight: '700' }}
								style={styles.button}
								onPress={() => {
									handleLoginView();
								}}
							>
								Registrar-se
							</Button>
						</Block>
					</Card>
				: <Card containerStyle={{ width: '100%' }}>
						<Card.Title>Registro</Card.Title>

						<Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
							<Input
								placeholder="Digite seu nome"
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

						<Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
							<Input
								placeholder="Digite seu e-mail"
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
								secureTextEntry
								placeholder="Digite sua senha"
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
								color="red"
								style={styles.button}
								onPress={() => {
									verifyCreateLogin();
								}}
							>
								Salvar
							</Button>
						</Block>
						<Block center>
							<Button
								color="secondary"
								textStyle={{ color: 'black', fontSize: 12, fontWeight: '700' }}
								style={styles.button}
								onPress={() => {
									handleLoginView();
								}}
							>
								Voltar ao login
							</Button>
						</Block>
					</Card>}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
	},
	button: {
		marginBottom: theme.SIZES.BASE,
		width: width - theme.SIZES.BASE * 6,
	},
	title: {
		fontSize: 30,
		fontWeight: 'bold',
		color: '#d44b42',
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
