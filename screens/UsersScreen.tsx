import * as React from 'react';
import { StyleSheet, SafeAreaView, FlatList, ScrollView, View, RefreshControl } from 'react-native';
import { ListItem, Card, Avatar } from 'react-native-elements';
import { getToken } from '../services/services/auth';
import api from '../services/api/axios';
import _ from 'lodash'

export default function CategoriesScreen({ navigation, route }) {
	const [data, setData] = React.useState([]);

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

	const getCollections = async () => {
		setRefreshing(true);
		try {
			const response = await api.get(`users?_sort=id:DESC&_limit=200`, {
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
		getCollections();
	}, []);

	const [refreshing, setRefreshing] = React.useState(false);

	const onRefresh = React.useCallback(() => {
		getCollections();
	}, []);

	const keyExtractor = (item, index) => index.toString();

	const renderItem = ({ item }) =>
		<ListItem key="2" bottomDivider>
			{
				item.avatar && <Avatar rounded size="medium" source={{uri: item.avatar.url}} />
			}
			<ListItem.Content>
				<ListItem.Title>{item.name}</ListItem.Title>
				<ListItem.Subtitle>ID: {item.id} - {item.username}</ListItem.Subtitle>
				<ListItem.Subtitle>{item.email}</ListItem.Subtitle>
			</ListItem.Content>
		</ListItem>

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
