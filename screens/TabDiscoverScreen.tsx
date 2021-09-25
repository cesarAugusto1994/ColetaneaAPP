import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import {
	StyleSheet,
	SafeAreaView,
	Dimensions,
	RefreshControl,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Card as CardRNE } from 'react-native-elements';
import { View } from '../components/Themed';
import { getToken } from '../services/services/auth';
import { Card } from '../components/galio';
import api from '../services/api/axios';
import { Block, theme, Text } from 'galio-framework';
import { isSignedIn } from '../services/services/auth';
const { width } = Dimensions.get('screen');

export default function TabOneScreen({ navigation }) {

	const [data, setData] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  
  const checkIsLogged = async () => {
    const response = await isSignedIn()
    if(!response) navigation.navigate("NotFound")
  }

  React.useEffect(() => {

    checkIsLogged()

	}, [])

	React.useEffect(() => {

		navigation.setOptions({
			title: 'Coletânea ICM',
			headerTintColor: '#d44b42',
			headerStyle: {
				borderBottomWidth: 0,
			},
			headerTitleStyle: {
				fontSize: 18,
			},
			// headerRight: () =>
			// 	<TouchableOpacity
			// 		style={{ marginRight: 15 }}
			// 		onPress={() => {
			// 			navigation.navigate('Pesquisar');
			// 		}}
			// 	>
			// 		<Ionicons name="ios-search" size={25} color="#d44b42" />
			// 	</TouchableOpacity>,
		});

	}, [])

	const onRefresh = React.useCallback(() => {
    checkIsLogged()
		getCollections();
	}, []);

	const getCollections = async () => {
		setRefreshing(true);
		try {
			const response = await api.get('postagens', {
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

	const renderArticles = () => {
    
		if (!data.length) return <Text>Carregando...</Text>

		return (
			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.articles} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
				<Block flex>
					{
						data.map((item, index) => {
							return (
								<Card
									key={index}
									navigateTo="DiscoverDetailsScreen"
									item={{ id: item.id, title: item.titulo, cta: item.descricao, image: item.imagem?.formats.thumbnail.url }}
									// style={{ marginRight: theme.SIZES.BASE }}
									horizontal
								/>
							)
						})
					}
				</Block>
			</ScrollView>
		);
	};

	return (
		<SafeAreaView style={styles.container}>

		{data.length
			? <Block flex center style={styles.home}>
					{renderArticles()}
				</Block>
			:	<View style={styles.notfound}>
					<CardRNE.Title style={styles.notfoundTitle}>NADA ENCONTRADO.</CardRNE.Title>
					<CardRNE.Divider />
				</View>
        }
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	home: {
		width: width,
	},
	articles: {
		width: width - theme.SIZES.BASE * 2,
		paddingVertical: theme.SIZES.BASE,
		backgroundColor: '#f6f6f6'
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
