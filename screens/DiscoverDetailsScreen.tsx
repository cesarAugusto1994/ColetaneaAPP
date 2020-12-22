import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import {
	StyleSheet,
	SafeAreaView,
	Dimensions,
	RefreshControl,
	ScrollView,
	Image,
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

export default function TabOneScreen({ navigation, route }) {

  const [data, setData] = React.useState(null);
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
		});

	}, [])

	const onRefresh = React.useCallback(() => {
    checkIsLogged()
		getCollections();
	}, []);

	const getCollections = async () => {
		setRefreshing(true);
		try {
			const response = await api.get(`postagens/${route.params.id}`, {
				headers: {
					Authorization: await getToken(),
				},
			});
			if (response) {
				console.log(response.data)
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

	if (!data) return <Text>Carregando...</Text>

	return (
		<SafeAreaView style={styles.container}>

		{data
			? <Block flex center style={styles.home}>

				{
					data.imagem && (
						<Block style={styles.imageContainer}>
                			<Image source={{uri: `http://coletanea-io.umbler.net${data.imagem?.formats.thumbnail.url}`}} style={{height: 215, width: '100%',}} />
              			</Block>
					)
				}

				<Block center>
					<CardRNE>
						<Text>{data.conteudo}</Text>
					</CardRNE>
				</Block>
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
	imageContainer: {
		borderRadius: 3,
		elevation: 1,
		overflow: 'hidden',
	},
});
