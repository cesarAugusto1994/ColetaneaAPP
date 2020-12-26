import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Avatar, Button, Image, ListItem } from 'react-native-elements';
import { Text, View } from '../components/Themed';
import { onSignOut, getUser } from '../services/services/auth';

export default function TabConfigsScreen({navigation}) {

	const [currentUser, setCurrentUser] = React.useState(null)

	React.useEffect(() => {
		navigation.setOptions({
			headerTintColor: '#d44b42',
			headerStyle: {
				borderBottomWidth: 0,
			},
			headerTitleStyle: {
				fontSize: 18,
			},
		});
	}, []);

	const getCurrentUser = async () => {
		const parseUser = await getUser()
		setCurrentUser(JSON.parse(parseUser))
	}

	React.useEffect(() => {

		getCurrentUser()

	}, [])

	const logout = () => {
		onSignOut().then(() => {
			navigation.navigate('NotFound');
		});
	};

	const navigateToFavorites = () => {
		navigation.navigate('Favoritos');
	};

	const navigateToAbout = () => {
		navigation.navigate('Sobre');
	};

	const navigateToUserEdition = () => {
		navigation.navigate('UserEditScreen');
	};

	const navigateToUsers = () => {
		navigation.navigate('Users');
	};

	const navigateToLogins = () => {
		navigation.navigate('Logins');
	};

	return (
		<View style={styles.container} onTouchStart={getCurrentUser}>
			{
				currentUser && (
					<View style={{ width: '100%', marginHorizontal: 20 }}>
						<ListItem key="2" bottomDivider onPress={navigateToUserEdition}>
							{
								currentUser.avatar && <Avatar rounded size="large" source={{uri: `https://minhacoletanea.com${currentUser.avatar.url}`}} />
							}
							<ListItem.Content>
								<ListItem.Title>{currentUser.name}</ListItem.Title>
								<ListItem.Subtitle>{currentUser.username}</ListItem.Subtitle>
								<ListItem.Subtitle>{currentUser.email}</ListItem.Subtitle>
							</ListItem.Content>
								<Button size="small" type="outline" title="Editar" onPress={navigateToUserEdition} style={{alignSelf: 'flex-end', right: 0}} />
						</ListItem>
					</View>
				)
			}
			
			<View style={{ width: '100%', marginHorizontal: 20 }}>
				<ListItem key="1" bottomDivider onPress={navigateToFavorites}>
					<ListItem.Content>
						<ListItem.Title>Favoritos</ListItem.Title>
					</ListItem.Content>
				</ListItem>
				<ListItem key="3" bottomDivider onPress={navigateToAbout}>
					<ListItem.Content>
						<ListItem.Title>Sobre o APP</ListItem.Title>
					</ListItem.Content>
				</ListItem>

				{
					currentUser && currentUser.role && currentUser.role.id === 3 && (
						<ListItem key="4" bottomDivider onPress={navigateToUsers}>
							<ListItem.Content>
								<ListItem.Title>Usuários</ListItem.Title>
							</ListItem.Content>
						</ListItem>
					)
				}

				{
					currentUser && currentUser.role && currentUser.role.id === 3 && (
						<ListItem key="4" bottomDivider onPress={navigateToLogins}>
							<ListItem.Content>
								<ListItem.Title>Logins</ListItem.Title>
							</ListItem.Content>
						</ListItem>
					)
				}
				
				<ListItem key="0" bottomDivider onPress={logout}>
					<ListItem.Content>
						<ListItem.Title style={{ color: 'red' }}>Sair</ListItem.Title>
					</ListItem.Content>
				</ListItem>
			</View>

			<View style={{ width: '100%', marginHorizontal: 20, position: 'absolute', bottom: 20, alignItems: 'center' }}>
				{/* <Text>Desenvolvido por César Augusto.</Text> */}
				<Text>Versão: 1.0.1</Text>
			</View>


		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		// justifyContent: 'center',
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%',
	},
});
