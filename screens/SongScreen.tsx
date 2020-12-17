import * as React from 'react';
import { StyleSheet, SafeAreaView, ScrollView, FlatList, StatusBar, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Parser, Chord, Chordify } from 'react-chord-parser';
import HTMLView from 'react-native-htmlview';
import { Text, View } from '../components/Themed';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import api from '../services/api/axios';
import Transposer from '../services/chord-transposer';
import { getToken } from '../services/services/auth';
import { Card, ListItem } from 'react-native-elements';

const _ = require('lodash');

const Item = ({ title }) =>
	<View style={styles.item}>
		<Text style={styles.title}>
			{title}
		</Text>
	</View>;

const tones = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];
const colors = ['#fcba03', '#d44b42', '#35d45d', '#3381d4'];

const FirstRoute = ({ data, handleShowHeader }) => {
	const [spanFontSize, setspanFontSize] = React.useState(15);
	const [favorite, setFavorite] = React.useState(false);
	const [showChord, setShowChord] = React.useState(true);
	const [darkMode, setDarkMode] = React.useState(false);

	const [chordColor, setChordColor] = React.useState('#fcba03');

	const [originalTom] = React.useState(data.tom);
	const [tom, setTom] = React.useState(data.tom);

	const getNextTone = () => {
		const currentIndex = tones.indexOf(tom);
		const nextIndex = (currentIndex + 1) % tones.length;
		if (!tones[nextIndex]) {
			return tones[0];
		}
		return tones[nextIndex];
	};

	const getPreviousTone = () => {
		const currentIndex = tones.indexOf(tom);
		const nextIndex = (currentIndex - 1) % tones.length;
		if (!tones[nextIndex]) {
			const lastItem = _.last(tones);
			return lastItem;
		}
		return tones[nextIndex];
	};

	const arrayWalk = () => {
		const currentIndex = tones.indexOf(tom);
		const nextIndex = (currentIndex + 1) % tones.length;
		if (!tones[nextIndex]) {
			const firstItem = tones[0];
			setTom(firstItem);
			return;
		}
		setTom(tones[nextIndex]);
	};

	const arrayReverseWalk = () => {
		const currentIndex = tones.indexOf(tom);
		const nextIndex = (currentIndex - 1) % tones.length;
		if (!tones[nextIndex]) {
			const lastItem = _.last(tones);
			setTom(lastItem);
			return;
		}
		setTom(tones[nextIndex]);
	};

	const getWords = () => {
		if (!data.letra) {
			return '<p>Letra não encontrada.</p>';
		}

		const w = Transposer.transpose(data.letra, showChord).fromKey(originalTom).toKey(tom).toString();
		return `<span>${w}</span>`;
	};

	const changeTextSizeDown = () => {
		if (spanFontSize <= 10) return;
		setspanFontSize(spanFontSize - 1);
	};

	const changeTextSizeUp = () => {
		if (spanFontSize >= 36) return;
		setspanFontSize(spanFontSize + 1);
	};

	const handleFavorite = () => {
		setFavorite(!favorite);
	};

	const handleShowChord = () => {
		console.log('fioi');
		setShowChord(!showChord);
	};

	const handleDarkMode = () => {
		setDarkMode(!darkMode);
	};

	const handleChordColor = () => {
		const currentIndex = colors.indexOf(chordColor);
		const nextIndex = (currentIndex + 1) % colors.length;
		if (!colors[nextIndex]) {
			setChordColor(colors[0]);
			return;
		}
		setChordColor(colors[nextIndex]);
	};

	const getNextChordColor = () => {
		const currentIndex = colors.indexOf(chordColor);
		const nextIndex = (currentIndex + 1) % colors.length;
		if (!colors[nextIndex]) {
			return colors[0];
		}
		return colors[nextIndex];
	};

	return (
		<SafeAreaView style={[styles.containerSafe, { backgroundColor: darkMode ? '#000000' : '#f5f5f5' }]}>
			<View style={[styles.navbar, { backgroundColor: darkMode ? '#000000' : '#f5f5f5' }]}>
				<View style={{ flex: 0.3, backgroundColor: darkMode ? '#000000' : '#f5f5f5' }}>
					{data.numero &&
						<Text style={[styles.descriptionsSong]}>
							Número: {data.numero}
						</Text>}

					<Text style={[styles.descriptionsSong, { color: !darkMode ? '#000000' : '#f5f5f5' }]}>
						Toalidade: {data.tom}
					</Text>
				</View>
			</View>

			<View style={{ flexDirection: 'row', backgroundColor: darkMode ? '#000000' : '#FFFFFF' }}>
				<View
					style={[
						styles.scene,
						{
							flex: 0.8,
							height: Dimensions.get('screen').height,
							backgroundColor: darkMode ? '#000000' : '#FFFFFF',
						},
						{},
					]}
				>
					<ScrollView
						contentContainerStyle={{ paddingVertical: 20, marginLeft: 15 }}
						showsVerticalScrollIndicator={false}
					>
						{data.letra
							? <HTMLView
									value={getWords()}
									stylesheet={{
										span: {
											fontSize: spanFontSize,
											color: !darkMode ? '#000000' : '#FFFFFF',
											marginBottom: 300,
										},
										i: { color: chordColor, fontWeight: 'bold' },
									}}
								/>
							: <Text>Letra não encontrada.</Text>}
					</ScrollView>
				</View>

				<View
					style={{
						flex: 0.2,
						// flexDirection: 'column',
						// alignSelf: 'flex-end',
						right: 0,
						marginRight: -15,
						alignItems: 'center',
						// position: 'absolute',
						top: '20%',

						width: 25,
						backgroundColor: darkMode ? '#000000' : '#FFFFFF',
						// height: 50,
						// alignItems: 'center',
						// justifyContent: 'center',
					}}
				>
					<TouchableOpacity style={styles.btnDown} onPress={changeTextSizeDown}>
						<Text style={{ fontSize: 14 }}>A-</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.btnUp} onPress={changeTextSizeUp}>
						<Text style={{ fontSize: 14 }}>A+</Text>
					</TouchableOpacity>

					{showChord &&
						<TouchableOpacity style={styles.btnDown} onPress={arrayReverseWalk}>
							<Text style={{ fontSize: 14 }}>
								{getPreviousTone()}
							</Text>
						</TouchableOpacity>}

					{showChord &&
						<TouchableOpacity style={styles.btnUp} onPress={arrayWalk}>
							<Text style={{ fontSize: 14 }}>
								{getNextTone()}
							</Text>
						</TouchableOpacity>}

					<TouchableOpacity style={styles.btnUp} onPress={handleDarkMode}>
						{darkMode
							? <Ionicons name="sunny-outline" size={15} />
							: <Ionicons name="moon-outline" size={15} />}
					</TouchableOpacity>

					<TouchableOpacity style={styles.btnUp} onPress={handleShowChord}>
						{!showChord
							? <FontAwesome5 name="guitar" size={15} color="black" />
							: <Ionicons name="ios-document-text-outline" size={15} />}
					</TouchableOpacity>

					<TouchableOpacity style={styles.btnUp} onPress={handleFavorite}>
						{favorite
							? <Ionicons name="ios-star" color="#ffd000" size={15} />
							: <Ionicons name="ios-star-outline" size={15} />}
					</TouchableOpacity>

					<TouchableOpacity style={styles.btnUp} onPress={handleChordColor}>
						<Ionicons name="color-palette-outline" color={getNextChordColor()} size={15} />
					</TouchableOpacity>

					<TouchableOpacity style={styles.btnUp} onPress={handleShowHeader}>
						<Ionicons name="expand-outline" size={15} />
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
};

const SecondRoute = ({ data }) => {
	return (
		<View style={[styles.scene, { backgroundColor: '#f5f5f5', padding: 20 }]}>
			<Text style={styles.descriptionsSong}>Autor: Não Informado</Text>
			{data.categoria &&
				<Text style={styles.descriptionsSong}>
					Categoria: {data.categoria.nome}
				</Text>}
			{data.categoria &&
				<Text style={styles.descriptionsSong}>
					Coleção: {data.categoria.colecao.nome}
				</Text>}
			<Text style={styles.descriptionsSong}>
				Atualizado Em: {data.cadastro}
			</Text>
		</View>
	);
};

const ThirdRoute = ({ data }) => {
	const keyExtractor = (item, index) => index.toString();

	const renderItem = ({ item }) =>
		<ListItem bottomDivider>
			{/* <Avatar title={item.nome.substring(0,2)} source={{uri: item.avatar_url}} /> */}
			<ListItem.Content>
				<ListItem.Title>
					{item.name}
				</ListItem.Title>
				<ListItem.Subtitle>
					Tam: {item.size} kbs
				</ListItem.Subtitle>
			</ListItem.Content>
		</ListItem>;

	return (
		<SafeAreaView style={styles.containerSafe}>
			<View style={[styles.scene, { backgroundColor: '#f5f5f5' }]}>
				{data.anexos && data.anexos.length > 0
					? <FlatList data={data.anexos} renderItem={renderItem} keyExtractor={keyExtractor} />
					: <View style={styles.notfound}>
							<Card.Title style={styles.notfoundTitle}>NENHUM ARQUIVO ENCONTRADO.</Card.Title>
							<Card.Divider />
						</View>}

				{/* 
				<Text style={styles.comments}>Comentários</Text>
				{data.comentarios && data.comentarios.length > 0
					? <FlatList
							data={data.comentarios}
							renderItem={({ item }) =>
								<View style={styles.item}>
									<Text style={styles.title}>
										{item.usuarios.nome}
									</Text>
									<Text style={styles.title}>
										{item.comentario}
									</Text>
								</View>}
							keyExtractor={item => item.id}
						/>
					: <Text>Nenhum comentário encontrado.</Text>} */}
			</View>
		</SafeAreaView>
	);
};
const initialLayout = { width: Dimensions.get('window').width };

export default function CategoriesScreen({ route, navigation }) {
	const [data, setData] = React.useState([]);
	const [showHeader, setShowHeader] = React.useState(true);

	navigation.setOptions({
		headerTintColor: '#ffffff',
		headerStyle: {
			backgroundColor: '#d44b42',
			borderBottomColor: '#d44b42',
			borderBottomWidth: 3,
		},
		headerTitleStyle: {
			fontSize: 18,
		},
		headerShown: showHeader,
		gesturesEnabled: false,
		tabBarVisible: false,
	});

	const handleShowHeader = () => {
		setShowHeader(!showHeader);
	};

	const getCollections = async () => {
		try {
			const response = await api.get(`musicas/${route.params.id}`, {
				headers: {
					Authorization: await getToken(),
				},
			});
			if (response) {
				console.log(response.data);
				setData(response.data);
			}
		} catch (error) {
			console.log('error', JSON.stringify(error));
		}
	};

	const [index, setIndex] = React.useState(0);
	const [routes] = React.useState([
		{ key: 'first', title: 'Letra' },
		{ key: 'second', title: 'Info.' },
		{ key: 'third', title: 'Mídias' },
	]);

	const renderScene = SceneMap({
		first: () => <FirstRoute data={data} handleShowHeader={handleShowHeader} />,
		second: () => <SecondRoute data={data} />,
		third: () => <ThirdRoute data={data} />,
	});

	React.useEffect(() => {
		getCollections();
	}, []);

	return (
		<TabView
			navigationState={{ index, routes }}
			renderScene={renderScene}
			onIndexChange={setIndex}
			initialLayout={initialLayout}
			tabBarPosition="top"
			// style={{ backgroundColor: "#333" }}
			renderTabBar={props =>
				<TabBar
					{...props}
					indicatorStyle={{ backgroundColor: 'white' }}
					style={{ backgroundColor: '#d44b42', height: 40 }}
					// indicatorStyle={{backgroundColor: "#555555"}}
				/>}
		/>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	navbar: { flexDirection: 'row', width: '100%', padding: 10 },
	title: {
		fontSize: 14,
	},
	scene: {
		flex: 1,
		// marginLeft: 15,
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
	descriptionsSong: {
		fontSize: 14,
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%',
	},
	containerSafe: {
		flex: 1,
		width: '100%',
	},
	item: {
		padding: 5,
		marginVertical: 8,
		marginHorizontal: 16,
	},
	btnDown: {
		padding: 10,
		paddingHorizontal: 10,
		margin: 3,
		backgroundColor: '#f5f5f5',
		borderRadius: 5,
	},
	btnUp: {
		padding: 10,
		paddingHorizontal: 10,
		margin: 3,
		backgroundColor: '#f5f5f5',
		borderRadius: 5,
	},
	comments: {
		alignSelf: 'center',
		fontSize: 20,
		fontWeight: 'bold',
	},
});
