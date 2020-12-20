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

	return (
		<View style={styles.container}>
			{
				currentUser && (
					<View style={{ width: '100%', marginHorizontal: 20 }}>
						<ListItem key="2" bottomDivider>
							<Avatar source={{uri: `http://coletanea-io.umbler.net${currentUser.avatar?.formats.medium.url}`}} />
							<ListItem.Content>
								<ListItem.Title>{currentUser.username}</ListItem.Title>
								<ListItem.Subtitle>{currentUser.email}</ListItem.Subtitle>
							</ListItem.Content>
						</ListItem>
					</View>
				)
			}
			
			<View style={{ width: '100%', marginHorizontal: 20 }}>
				<ListItem key="0" bottomDivider onPress={logout}>
					<ListItem.Content style={{ alignItems: 'center' }}>
						<ListItem.Title style={{ color: 'red' }}>Sair</ListItem.Title>
					</ListItem.Content>
				</ListItem>
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
