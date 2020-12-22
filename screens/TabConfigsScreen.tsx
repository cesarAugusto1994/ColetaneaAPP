import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Avatar, Image, ListItem } from 'react-native-elements';
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

	return (
		<View style={styles.container} onTouchStart={getCurrentUser}>
			{
				currentUser && (
					<View style={{ width: '100%', marginHorizontal: 20 }}>
						<ListItem key="2" bottomDivider onPress={navigateToUserEdition}>
							{
								currentUser.avatar && <Avatar rounded size="large" source={{uri: `http://coletanea-io.umbler.net${currentUser.avatar.url}`}} />
							}
							<ListItem.Content>
								<ListItem.Title>{currentUser.username}</ListItem.Title>
								<ListItem.Subtitle>{currentUser.email}</ListItem.Subtitle>
							</ListItem.Content>
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
				<ListItem key="0" bottomDivider onPress={logout}>
					<ListItem.Content>
						<ListItem.Title style={{ color: 'red' }}>Sair</ListItem.Title>
					</ListItem.Content>
				</ListItem>
			</View>

			<View style={{ width: '100%', marginHorizontal: 20, position: 'absolute', bottom: 20, alignItems: 'center' }}>
				{/* <Text>Desenvolvido por César Augusto.</Text> */}
				<Text>Versão: 1.0.0</Text>
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
