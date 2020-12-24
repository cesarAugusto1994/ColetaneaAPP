import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import {
	StyleSheet,
	SafeAreaView,
	FlatList,
	StatusBar,
	Button,
	Dimensions,
	RefreshControl,
	ScrollView,
	TouchableOpacity,
} from 'react-native';
import { Avatar, Image, ListItem, Card } from 'react-native-elements';
import { View } from '../components/Themed';
import { getToken } from '../services/services/auth';
import api from '../services/api/axios';
import { Block, theme, Text } from 'galio-framework';
import moment from 'moment'
const { width } = Dimensions.get('screen');


export default function GroupScreen({ navigation, route }) {
	const [data, setData] = React.useState([]);

	React.useEffect(() => {
		navigation.setOptions({
			title: 'Listas',
			headerTintColor: '#d44b42',
			headerStyle: {
				borderBottomWidth: 0,
			},
			headerTitleStyle: {
				fontSize: 18,
			},
			headerRight: () =>
			<TouchableOpacity
				style={{ marginRight: 15 }}
				onPress={() => {
					navigation.navigate('GroupListAdd');
				}}
			>
				<Ionicons name="ios-add-outline" size={25} color="#fff" />
			</TouchableOpacity>
		});
	}, []);

	const [refreshing, setRefreshing] = React.useState(false);

	const onRefresh = React.useCallback(() => {
		getCollections();
	}, []);

	const getCollections = async () => {
		setRefreshing(true);
		try {
			const response = await api.get(`grupo-listas`, {
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

	if (!data) return <Text>Nada</Text>;

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView
				contentContainerStyle={styles.scrollView}
				// refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
			>
					{data && data?.map((lista, i) =>
						<Card key={i} containerStyle={{ padding: 0 }}>
							<ListItem onPress={() => {
									navigation.navigate('GroupListsDetails', {
										id: lista.id,
										title: `${lista.tipo} do dia ${moment(lista.data).format('DD/MM/YY')}`,
									});
								}}>
									<ListItem.Content>
										<ListItem.Title>
											{lista.tipo} do dia {moment(lista.data).format('DD/MM/YY')}
										</ListItem.Title>
									</ListItem.Content>
								</ListItem>
						</Card>
					)}

			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	home: {
		width: width,
	},
	articles: {
		width: width - theme.SIZES.BASE * 2,
		paddingVertical: theme.SIZES.BASE,
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
	scrollView: {
		flex: 1,
		width: '100%',
	},
	title: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#fff',
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%',
	},
	item: {
		backgroundColor: '#d44b42',
		padding: 10,
		marginVertical: 6,
		marginHorizontal: 10,
		flex: 1,
		alignItems: 'center',
		borderRadius: 7,
	},
});
