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
  TouchableOpacity
} from 'react-native';
import { Avatar, Image, ListItem, Card as CardRNE } from 'react-native-elements';
import { View } from '../components/Themed';
import { getToken } from '../services/services/auth';
import { Card } from '../components/galio';
import api from '../services/api/axios';
import { Block, theme, Text } from 'galio-framework';
const { width } = Dimensions.get('screen');

const Item = ({ title }) =>
	<View style={styles.item}>
		<Text style={styles.title}>
			{title}
		</Text>
	</View>;

export default function TabOneScreen({ navigation }) {
	const [data, setData] = React.useState([]);

	navigation.setOptions({
		title: 'Home',
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
					navigation.navigate('Pesquisar');
				}}
			>
				<Ionicons name="ios-search" size={25} color="#fff" />
			</TouchableOpacity>,
	});

	const [refreshing, setRefreshing] = React.useState(false);

	const onRefresh = React.useCallback(() => {
		getCollections();
	}, []);

	const getCollections = async () => {
		setRefreshing(true);
		try {
			const response = await api.get('colecoes', {
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
						item={{ id: data[1].id, title: data[1].nome, cta: data[1].descricao, image: data[1].imagem.formats.thumbnail.url }}
						horizontal
					/>
					<Block flex row>
						<Card
							navigateTo="Categorias"
							item={{ id: data[0].id, title: data[0].nome, cta: data[0].descricao, image: data[0].imagem.formats.thumbnail.url }}
							style={{ marginRight: theme.SIZES.BASE }}
						/>
						<Card
							navigateTo="Categorias"
							item={{ id: data[2].id, title: data[2].nome, cta: data[2].descricao, image: data[2].imagem.formats.thumbnail.url }}
						/>
					</Block>
					<Card
						navigateTo="Categorias"
						item={{ id: data[3].id, title: data[3].nome, cta: data[3].descricao, image: data[3].imagem.formats.thumbnail.url }}
						horizontal
					/>
					<Block flex row>
					{
						data[7] && (
							<Card
								navigateTo="Categorias"
								item={{ id: data[7].id, title: data[7].nome, cta: data[7].descricao, image: data[7].imagem?.formats.thumbnail.url }}
								style={{ marginRight: theme.SIZES.BASE }}
							/>
						)
					}

					{
						data[6] && (
							<Card
								navigateTo="Categorias"
								item={{ id: data[6].id, title: data[6].nome, cta: data[6].descricao, image: data[6].imagem?.formats.thumbnail.url }}
								style={{ marginRight: theme.SIZES.BASE }}
							/>
						)
					}

					</Block>

					
					
					
				</Block>
			</ScrollView>
		);
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView
				contentContainerStyle={styles.scrollView}
				// refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
			>
				{data.length
					? <Block flex center style={styles.home}>
							{renderArticles()}
						</Block>
					:	<View style={styles.notfound}>
							<CardRNE.Title style={styles.notfoundTitle}>NADA ENCONTRADO.</CardRNE.Title>
							<CardRNE.Divider />
						</View>
        }
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
