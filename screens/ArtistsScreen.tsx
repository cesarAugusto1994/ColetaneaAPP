import * as React from 'react';
import { StyleSheet, SafeAreaView, FlatList, View, TouchableHighlight } from 'react-native';
import { ListItem, Card, Avatar } from 'react-native-elements';
import { getToken, getUser } from '../services/services/auth';
import api from '../services/api/axios';
import _ from 'lodash';
import { Ionicons } from '@expo/vector-icons';

export default function CategoriesScreen({ navigation, route }) {
	const [data, setData] = React.useState([]);
	const [refreshing, setRefreshing] = React.useState(false);
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

	const getCollections = async () => {
		setRefreshing(true);
		try {
			const response = await api.get(`artistas`, {
				headers: {
					Authorization: await getToken(),
				},
			});
			if (response) {
				setData(response.data);
				setRefreshing(false);
			}
		} catch (error) {
			setRefreshing(false);
			console.log('error', JSON.stringify(error));
		}
	};

	React.useEffect(() => {
		if (route.params && route.params.reload) {
			getCollections();
		}
	}, [route.params])

	React.useEffect(() => {
		getCollections();
	}, []);

	const onRefresh = React.useCallback(() => {
		getCollections();
	}, []);

	const keyExtractor = (item, index) => index.toString();

	const renderItem = ({ item }) => {
		return (<ListItem
			bottomDivider
			onPress={() => {
				navigation.navigate('ArtistSongs', {
					id: item.id,
					title: item.nome,
				});
			}}
		>
			{
				item.imagem && <Avatar rounded size="medium" source={{uri: item.imagem.url}} />
			}
			<ListItem.Content>
				<ListItem.Title>
					{item.nome}
				</ListItem.Title>
			</ListItem.Content>
			<ListItem.Chevron />
		</ListItem>)};

	if (refreshing)
		return (
			<View style={styles.notfound}>
				<Card.Title style={styles.notfoundTitle}>Carregando os Autores...</Card.Title>
				<Card.Divider />
			</View>
		);

	return (
		<SafeAreaView style={styles.container}>
			{data.length
				? <FlatList data={data} renderItem={renderItem} scrollEnabled keyExtractor={keyExtractor} />
				: <View style={styles.notfound}>
						<Card.Title style={styles.notfoundTitle}>NADA ENCONTRADO.</Card.Title>
						<Card.Divider />
					</View>}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	scrollView: {
		flex: 1,
		width: '100%',
	},
	notfound: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#f5f5f5',
	},
	notfoundTitle: {
		fontSize: 18,
	},
	title: {
		fontSize: 14,
		fontWeight: 'bold',
		alignSelf: 'center',
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%',
	},
	item: {
		backgroundColor: '#f5f5f5',
		padding: 12,
		marginVertical: 8,
		marginHorizontal: 16,
		alignItems: 'center',
		textAlign: 'center',
		borderRadius: 7,
		flex: 1,
	},
});
