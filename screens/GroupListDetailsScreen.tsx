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
		title: 'Lista',
		headerTintColor: '#ffffff',
		headerStyle: {
			backgroundColor: '#d44b42',
			borderBottomColor: '#d44b42',
			borderBottomWidth: 3,
		},
		headerTitleStyle: {
			fontSize: 18,
		},
	});

	const [refreshing, setRefreshing] = React.useState(false);

	const onRefresh = React.useCallback(() => {
		getCollections();
	}, []);

	const getCollections = async () => {
		setRefreshing(true);
		try {
			const response = await api.get(`grupo-listas/${route.params.id}`, {
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
			console.log('error', JSON.stringify(error.config));
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

				<Card>
					<Card.Title>{data.tipo} do dia {moment(data.data).format('DD/MM/YY')}</Card.Title>
					<Card.Divider/>
					{data.musicas && data.musicas?.map((musica, i) =>
						<ListItem key={i} bottomDivider  onPress={() => {
							navigation.navigate('Musica', {
								id: musica.id,
								title: musica.nome,
							});
						}}>
							<ListItem.Content>
								<ListItem.Title>
									{musica.nome}
								</ListItem.Title>
								<ListItem.Subtitle>
									{musica.nome}
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
