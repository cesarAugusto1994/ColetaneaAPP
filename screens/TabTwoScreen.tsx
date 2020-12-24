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
import { Avatar, Image, ListItem, Card as CardRNE } from 'react-native-elements';
import { View } from '../components/Themed';
import { getToken } from '../services/services/auth';
import { Card } from '../components/galio';
import api from '../services/api/axios';
import { Block, theme, Text } from 'galio-framework';
const { width } = Dimensions.get('screen');
import { getUser } from '../services/services/auth';

export default function TabOneScreen({ navigation }) {
	const [data, setData] = React.useState([]);
	const [refreshing, setRefreshing] = React.useState(false);
	const [currentUser, setCurrentUser] = React.useState(null);

	const getCurrentUser = async () => {
		const parseUser = await getUser();
		setCurrentUser(JSON.parse(parseUser));
	};

	React.useEffect(() => {
		getCurrentUser();
	}, []);

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

	const onRefresh = React.useCallback(() => {
		getCollections();
	}, []);

	const getCollections = async () => {
		setRefreshing(true);
		try {
			const response = await api.get(`users/${currentUser.id}`, {
				headers: {
					Authorization: await getToken(),
				},
			});
			if (response.data) {
				setData(response.data);
				setRefreshing(false);
			}
		} catch (error) {
			setRefreshing(false);
			console.log('error', JSON.stringify(error));
		}
	};

	React.useEffect(
		() => {
			if (currentUser) {
				getCollections();
			}
		},
		[currentUser]
	);

	const keyExtractor = (item, index) => index.toString();

	const renderItem = ({ item }) =>
		<ListItem
			bottomDivider
			onPress={() => {
				navigation.navigate('Group', {
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

	return (
		<SafeAreaView style={styles.container}>
			{data.grupos && data.grupos.length
				? <FlatList data={data.grupos} scrollEnabled renderItem={renderItem} keyExtractor={keyExtractor} />
				: <View style={styles.notfound}>
						<CardRNE.Title style={styles.notfoundTitle}>NADA ENCONTRADO.</CardRNE.Title>
						<CardRNE.Divider />
					</View>}
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
