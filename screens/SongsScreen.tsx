import * as React from 'react';
import { StyleSheet, SafeAreaView, FlatList, TouchableHighlight } from 'react-native';
import { Card, ListItem } from 'react-native-elements';
import { Text, View } from '../components/Themed';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api/axios';
import _ from 'lodash';
import { getToken, getUser } from '../services/services/auth';

export default function CategoriesScreen({ navigation, route }) {
	const [data, setData] = React.useState([]);
	const [refreshing, setRefreshing] = React.useState(false);
	const [currentUser, setCurrentUser] = React.useState(null)

	const getCurrentUser = async () => {
		const parseUser = await getUser()
		setCurrentUser(JSON.parse(parseUser))
	}

	React.useEffect(() => {
		getCurrentUser()
	}, [])

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

	React.useEffect(() => {

		if(currentUser && currentUser.role && currentUser.role.id === 3) { 
			navigation.setOptions({
				headerRight: () =>
				<TouchableHighlight
					style={{ marginRight: 15 }}
					onPress={() => {
						navigation.navigate('SongAdd', {
							id: route.params.id
						})
					}}
				>
					<Ionicons name="ios-add-outline" size={25} color="#d44b42" />
				</TouchableHighlight>,
			});
		}
		
  }, [currentUser]);

	const onRefresh = React.useCallback(() => {
		getSongs();
	}, []);

	// React.useEffect(() => {
	// 	navigation.addListener('focus', () => getSongs());
	// }, []);

	const getSongs = async () => {
		setRefreshing(true);
		try {
			const response = await api.get(`categoria/${route.params.id}/musicas`, {
				headers: {
					Authorization: await getToken(),
				},
			});
			if (response) {

				const songs = response.data;
				songs.map(song => {
					if(song.numero) {
						song.numero = parseInt(song.numero, 10);
					}
					delete song.anexos
					delete song.videos
				});
				const sort = _.sortBy(songs, 'numero')
				setData(sort);

				setRefreshing(false);
			}
		} catch (error) {
			setRefreshing(false);
			console.log('error', error);
		}
	};

	React.useEffect(() => {
		getSongs();
	}, []);

	const keyExtractor = (item, index) => index.toString();

	const renderItem = ({ item }) =>
		<ListItem
			bottomDivider
			onPress={() => {
				navigation.navigate('Musica', {
					id: item.id,
					title: item.nome,
				});
			}}
		>
			{/* <Avatar title={item.nome.substring(0,2)} source={{uri: item.avatar_url}} /> */}
			<ListItem.Content>
				<ListItem.Title>
					<Text>
						{item.numero && `${item.numero} - `}
						{item.nome} {item.tom && `(${item.tom})`}
					</Text>
				</ListItem.Title>
				{/* <ListItem.Subtitle><Text>Tonalidade: {item.tom}</Text></ListItem.Subtitle> */}
			</ListItem.Content>
			<ListItem.Chevron />
		</ListItem>;

	if (refreshing)
		return (
			<View style={styles.notfound}>
				<Card.Title style={styles.notfoundTitle}>Carregando...</Card.Title>
				<Card.Divider />
			</View>
		);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.result}>
				<Text style={styles.resultText}>{data.length} Registro(s) Encontrado(s)</Text>
			</View>
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
	notfound: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#f5f5f5',
	},
	notfoundTitle: {
		fontSize: 18,
	},
	result: {
		alignItems: 'center',
		paddingVertical: 5,
		backgroundColor: '#f5f5f5'
	},
	resultText: {
		fontSize: 10
	},
	scrollView: {
		flex: 1,
		width: '100%',
	},
	title: {
		fontSize: 14,
		fontWeight: 'bold',
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%',
	},

	containerSafe: {
		flex: 1,
		width: '100%',
	},
	item: {
		backgroundColor: '#f5f5f5',
		padding: 12,
		marginVertical: 8,
		marginHorizontal: 16,
	},
});
