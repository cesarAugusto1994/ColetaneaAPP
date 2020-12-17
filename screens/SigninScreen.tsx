import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Card, Button, Input } from 'react-native-elements';
import api from '../services/api/axios';
import {isSignedIn} from '../services/services/auth';

export default function NotFoundScreen({navigation}) {

  const [username, setUsername] = React.useState("cesar a");
  const [email, setEmail] = React.useState("cezzaar@gmail.com");
  const [password, setPassword] = React.useState("12345678");
  
  const [loginView, setloginView] = React.useState(true);

  const handleLoginView = () => {

    setloginView(!loginView)

  }

	const verifyCreateLogin = async () => {
	  try {
	    const response = await api.post("auth/local/register", { email, username, password }, {
	      data: { email, username, password, role: "reader" },
	      headers: {
	        "Content-Type": "application/json"
	      }
	    });
	    if (response) {
	      if(response.data) {
          if(response.data.jwt) {
            alert("Usuário Cadastrado com sucesso!")
            verifyLogin()
          }
	      } else {
	        alert("Ocorreu um erro inesperado.")
	      }
	    }
	  } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx

        if(error.response.data) {

          const messages = error.response.data.data

          if(Array.isArray(messages)) {

            const firstMessage = messages

            if(Array.isArray(firstMessage)) {

              const data = firstMessage[0].messages

              console.log("asdfgbl")

              if(Array.isArray(data)) {
                alert(data[0].message)
              }

            }
            console.log(firstMessage.messages[0].message)
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
          onSignIn(response.data).then(() => navigation.navigate("Root", { screen: 'TabOneScreen' }));
				} else {
					alert('Registrado Com Sucesso');
				}
			}
		} catch (error) {
			// alert(error.data.message)
      // console.log("error", error);
      // console.log("config", error.config);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Minha Coletânea</Text>

			{loginView
				? <Card containerStyle={{ width: '100%' }}>
						<Card.Title>Login</Card.Title>
						<Input
							placeholder="Digite seu e-mail"
							leftIcon={{ type: 'font-awesome', name: 'user' }}
              onChangeText={text => setEmail(text)}
						/>
						<Input
							secureTextEntry
							placeholder="Digite sua senha"
							leftIcon={{ type: 'font-awesome', name: 'key' }}
              onChangeText={text => setPassword(text)}
						/>

						<Button
							buttonStyle={{ marginTop: 20, backgroundColor: '#03A9F4' }}
							title="Entrar"
							onPress={() => {
								verifyLogin();
								// onSignIn().then(() => navigation.navigate("SignedIn"));
							}}
						/>
						<Button
							buttonStyle={{ marginTop: 20, backgroundColor: '#03A9F4' }}
							title="Registrar-se"
							type="clear"
							onPress={() => {
                handleLoginView()
              }}
						/>
					</Card>
				: <Card containerStyle={{ width: '100%' }}>
						<Card.Title>Registro</Card.Title>
            <Input
							placeholder="Digite seu nome"
							leftIcon={{ type: 'font-awesome', name: 'user' }}
              onChangeText={text => setUsername(text)}
						/>
						<Input
							placeholder="Digite seu e-mail"
							leftIcon={{ type: 'font-awesome', name: 'at' }}
              onChangeText={text => setEmail(text)}
						/>
						<Input
							secureTextEntry
							placeholder="Digite sua senha"
							leftIcon={{ type: 'font-awesome', name: 'key' }}
              onChangeText={text => setPassword(text)}
						/>

						<Button
							buttonStyle={{ marginTop: 20, backgroundColor: '#03A9F4' }}
							title="Salvar"
							onPress={() => {
								verifyCreateLogin();
							}}
						/>
						<Button
							buttonStyle={{ marginTop: 20, backgroundColor: '#03A9F4' }}
							title="Voltar ao login"
							type="clear"
							onPress={() => {
                handleLoginView()
              }}
						/>
					</Card>}

			{/* <TextInput
        placeholder="E-mail"
        style={{
          width: "100%",
          backgroundColor: "#f5f5f5",
          padding: 10,
          marginVertical: 15
        }}
      />
      <TextInput
        placeholder="Senha"
        style={{ width: "100%", backgroundColor: "#f5f5f5", padding: 10 }}
        secureTextEntry={true}
      />
      <TouchableOpacity onPress={verifyLogin} style={styles.link}>
        <Text style={styles.linkText}>Logar</Text>
      </TouchableOpacity> */}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#d44b42',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
	},
	title: {
		fontSize: 30,
		fontWeight: 'bold',
		color: '#FFF',
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
