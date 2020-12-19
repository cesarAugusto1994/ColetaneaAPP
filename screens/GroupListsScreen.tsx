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

const Item = ({ title }) =>
	<View style={styles.item}>
		<Text style={styles.title}>
			{title}
		</Text>
	</View>;

export default function GroupScreen({ navigation, route }) {
	const [data, setData] = React.useState([]);

	navigation.setOptions({
		title: 'Listas',
		headerTintColor: '#ffffff',
		headerStyle: {
			backgroundColor: '#d44b42',
			borderBottomColor: '#d44b42',
			borderBottomWidth: 3,
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
			console.log(response.data);
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

	const keyExtractor = (item, index) => index.toString();

	const renderItem = ({ item }) =>
		<ListItem
			bottomDivider
			onPress={() => {
				navigation.navigate('Categorias', {
					id: item.id,
					title: item.nome,
				});
			}}
		>
			<Avatar size="medium" title={item.nome.substring(0, 2)} source={{ uri: item.avatar_url }} />
			<ListItem.Content>
				<ListItem.Title>
					{item.nome}
				</ListItem.Title>
			</ListItem.Content>
			<ListItem.Chevron />
		</ListItem>;

	const renderArticles = () => {
		if (!data.length) return <Text>Nada</Text>;

		return (
			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.articles}>
				<Block flex>
					<Card
						navigateTo="Categorias"
						item={{ id: data[0].id, title: data[0].nome, cta: data[0].descricao }}
						horizontal
					/>
				</Block>
			</ScrollView>
		);
	};

	if (!data) return <Text>Nada</Text>;

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView
				contentContainerStyle={styles.scrollView}
				// refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
			>

					{data && data?.map((lista, i) =>
						<Card containerStyle={{ padding: 0 }}>
							<ListItem key={i} onPress={() => {
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
