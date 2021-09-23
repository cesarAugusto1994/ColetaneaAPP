import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import {
	StyleSheet,
	SafeAreaView,
	Dimensions,
	RefreshControl,
	ScrollView,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native';
import { Card as CardRNE, Button } from 'react-native-elements';
import { View } from '../components/Themed';
import { getToken, getUser } from '../services/services/auth';
import { Card } from '../components/galio';
import api from '../services/api/axios';
import { Block, theme, Text } from 'galio-framework';
import { isSignedIn } from '../services/services/auth';
const { width } = Dimensions.get('screen');
import registerForPushNotificationsAsync, { registerUserToken, sendPushNotification } from '../utils/pushNotifications'
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
	handleNotification: async () => ({
	  shouldShowAlert: true,
	  shouldPlaySound: true,
	  shouldSetBadge: true,
	}),
});

export default function TabOneScreen({ navigation }) {

	const [data, setData] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState(null)

  const [expoPushToken, setExpoPushToken] = React.useState('');
  const [notification, setNotification] = React.useState(false);
  const notificationListener = React.useRef();
  const responseListener = React.useRef();

	const getCurrentUser = async () => {
		const parseUser = await getUser()
		setCurrentUser(JSON.parse(parseUser))
	}

	React.useEffect(() => {
		getCurrentUser()
  }, [])
  
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
			headerRight: () =>
				<TouchableOpacity
					style={{ marginRight: 15 }}
					onPress={() => {
						navigation.navigate('Pesquisar');
					}}
				>
					<Ionicons name="ios-search" size={25} color="#d44b42" />
				</TouchableOpacity>,
		});

	}, [])

	const onRefresh = React.useCallback(() => {
    checkIsLogged()
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

	React.useEffect(() => {

    if(currentUser) {

      registerForPushNotificationsAsync().then(token => {
        setExpoPushToken(token)
        if(currentUser && currentUser.expo_token !== token) {
          registerUserToken(token)
          const messageBody = {
            title: `Minha Coletânea: Olá, seja bem vindo(a) ${currentUser.name && currentUser.name}`,
            body: 'Este app foi criado com o objetivo de auxíliar intrumentistas e grupo de louvor com o compartilhamento de louvores de forma fácil e acessível.'
          }
          sendPushNotification(token, messageBody)
        }
      });
    
      // This listener is fired whenever a notification is received while the app is foregrounded
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });
    
      // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        // console.log(response);
      });
    
      return () => {
        Notifications.removeNotificationSubscription(notificationListener);
        Notifications.removeNotificationSubscription(responseListener);
      };

    }

	}, [currentUser]);

	const renderArticles = () => {
    
		if (!data.length) return <Text>Nada</Text>

		return (
			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.articles} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
				<Block flex>
						{
							data.map((item, index) => {
								return (
									<Card
                    					key={index}
										navigateTo="Categorias"
										item={{ id: item.id, title: item.nome, cta: item.descricao, image: item.imagem?.formats.thumbnail.url }}
										// style={{ marginRight: theme.SIZES.BASE }}
										// horizontal
									/>
								)
							})
						}
					{/* <Block flex row>
						<Card
							navigateTo="Categorias"
							item={{ id: data[1].id, title: data[1].nome, cta: data[1].descricao, image: data[1].imagem.formats.thumbnail.url }}
							// style={{ marginRight: theme.SIZES.BASE }}
						/>
						<Card
							navigateTo="Categorias"
							item={{ id: data[3].id, title: data[3].nome, cta: data[3].descricao, image: data[3].imagem.formats.thumbnail.url }}
							// style={{ marginRight: theme.SIZES.BASE }}
						/>
					</Block>
					<Block flex row>
						<Card
							navigateTo="Categorias"
							item={{ id: data[0].id, title: data[0].nome, cta: data[0].descricao, image: data[0].imagem.formats.thumbnail.url }}
							style={{ marginRight: theme.SIZES.BASE }}
						/>
						<Card
							navigateTo="Categorias"
							item={{ id: data[2].id, title: data[2].nome, cta: data[2].descricao, image: data[2].imagem.formats.thumbnail.url }}
							style={{ marginRight: theme.SIZES.BASE }}
						/>
					</Block>
					
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

					</Block> */}

				</Block>
			</ScrollView>
		);
	};

	return (
		<SafeAreaView style={styles.container}>

			{
				refreshing && <ActivityIndicator size="large" color="#d44b42" />
			}

		{data.length
			? <Block flex center style={styles.home}>
					{renderArticles()}
				</Block>
			:	<View style={styles.notfound}>
					<CardRNE.Title style={styles.notfoundTitle}>NADA ENCONTRADO.</CardRNE.Title>
					<CardRNE.Divider />
					<Button title="Atualizar Tela" onPress={onRefresh} />
				</View>
        }
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5'
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
