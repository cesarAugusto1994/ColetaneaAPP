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
const { width } = Dimensions.get('screen');

const Item = ({ title }) =>
	<View style={styles.item}>
		<Text style={styles.title}>
			{title}
		</Text>
	</View>;

export default function GroupScreen({ navigation, route }) {
	const [data, setData] = React.useState([]);

	React.useEffect(() => {
		navigation.setOptions({
			title: 'Participantes',
			headerTintColor: '#d44b42',
			headerStyle: {
				borderBottomWidth: 0,
			},
			headerTitleStyle: {
				fontSize: 18,
			},
		});
	}, []);

	const [refreshing, setRefreshing] = React.useState(false);

	const onRefresh = React.useCallback(() => {
		getCollections();
	}, []);

	const getCollections = async () => {
		setRefreshing(true);
		try {
			const response = await api.get(`grupos/${route.params.id}`, {
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
			<Avatar rounded  size="medium" title={item.nome.substring(0, 2)} source={{ uri: item.avatar_url }} />
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

				<Card containerStyle={{ padding: 0 }}>
					{data.usuarios && data.usuarios?.map((u, i) =>
						<ListItem key={i} bottomDivider>
							<Avatar title={u.username.substring(0, 2)} source={{ uri: u.avatar ? `http://192.168.15.16:1337${u.avatar.formats.thumbnail.url}` : null }} />
							<ListItem.Content>
								<ListItem.Title>
									{u.username}
								</ListItem.Title>
								<ListItem.Subtitle>
									{u.subtitle}
								</ListItem.Subtitle>
							</ListItem.Content>
						</ListItem>
					)}
				</Card>

				{/* {data.length
				?	// ? <Block flex center style={styles.home}>
					// 		{renderArticles()}
					// 	</Block>
					 <FlatList
						  data={data}
						  scrollEnabled
						  renderItem={renderItem}
						  keyExtractor={keyExtractor}
						/>
					:	<View style={styles.notfound}>
							<CardRNE.Title style={styles.notfoundTitle}>NADA ENCONTRADO.</CardRNE.Title>
							<CardRNE.Divider />
						</View>
        } */}
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
