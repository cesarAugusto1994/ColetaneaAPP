import * as React from 'react';
import { StyleSheet, SafeAreaView, ScrollView, FlatList, Platform, Dimensions, TouchableOpacity } from 'react-native';
import WebView from 'react-native-webview';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import HTMLView from 'react-native-htmlview';
import { Text, View } from '../components/Themed';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import api from '../services/api/axios';
import Transposer from '../services/chord-transposer';
import { getToken } from '../services/services/auth';
import { Button, Card, ListItem } from 'react-native-elements';
import ChordTab from '../components/ChordTab';
import * as FileSystem from 'expo-file-system';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import moment from 'moment';
import { TouchableHighlight } from 'react-native-gesture-handler';


const _ = require('lodash');

const tones = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];
const colors = ['#fcba03', '#d44b42', '#35d45d', '#3381d4'];

const FirstRoute = ({ data, handleShowHeader, navigation }) => {
	const [spanFontSize, setspanFontSize] = React.useState(15);
	const [favorite, setFavorite] = React.useState(false);
	const [showChord, setShowChord] = React.useState(true);
	const [darkMode, setDarkMode] = React.useState(false);
	const [openBottomSheet, setOpenBottomSheet] = React.useState(false);
	const [selectedChord, selectChord] = React.useState(null);
	const [allChords, setAllChords] = React.useState([]);
	const [song, setSong] = React.useState('');
	const [version, setVesrion] = React.useState('normal');
	const sheetRef = React.useRef(null);

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

	const setChords = React.useCallback(list => {
		setAllChords(list);
	}, []);

	const getPreviousTone = () => {
		const currentIndex = tones.indexOf(tom);
		const nextIndex = (currentIndex - 1) % tones.length;
		if (!tones[nextIndex]) {
			const lastItem = _.last(tones);
			return lastItem;
		}
		return tones[nextIndex];
	};

	const arrayWalk = async () => {
		const currentIndex = tones.indexOf(tom);
		const nextIndex = (currentIndex + 1) % tones.length;
		if (!tones[nextIndex]) {
			const firstItem = tones[0];
			setTom(firstItem);
			return;
		}
		setTom(tones[nextIndex]);
		await handleGetVersion(version, showChord, tones[nextIndex])
	};

	const arrayReverseWalk = async () => {
		const currentIndex = tones.indexOf(tom);
		const nextIndex = (currentIndex - 1) % tones.length;
		if (!tones[nextIndex]) {
			const lastItem = _.last(tones);
			setTom(lastItem);
			return;
		}
		setTom(tones[nextIndex]);
		await handleGetVersion(version, showChord, tones[nextIndex])
	};

	React.useEffect(() => {
		handleGetVersion('normal');
	}, []);

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

	const handleShowChord = async () => {
		setShowChord(!showChord);
		await handleGetVersion(version, !showChord, tom);
	};

	const handleDarkMode = () => {
		setDarkMode(!darkMode)
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

	let styleSheetWebView = {
		
		i: { color: chordColor, fontWeight: 'bold', fontSize: spanFontSize },
		span: {
			fontSize: spanFontSize,
			color: !darkMode ? '#000000' : '#FFFFFF',
			// color: chordColor,
			marginBottom: 300,
			// i: { color: chordColor, fontWeight: 'bold', fontSize: spanFontSize },
		},
	};

	const handleOpenBootmSheet = () => {
		setOpenBottomSheet(!openBottomSheet);
	};

	const handleGetVersion = async (currentVersion = 'normal', showAllChords = true, tom = originalTom) => {

		if (!data.letra) {
			setSong(`<p>Letra não encontrada.</p>`);
			return;
		}
		const transp = Transposer.transpose(
			currentVersion === 'normal' ? data.letra : data.letra_simplificada,
			showAllChords
		);
		const words = transp.fromKey(originalTom).toKey(tom).toString();
		const a = transp.getAllChords();
		if (!allChords.length) setChords(a);
		setSong(`<span><pre>${words}</pre></span>`);
	};

	const handleChangeVersion = async () => {
		setVesrion(version === 'normal' ? 'simplificada' : 'normal');
		await handleGetVersion(version === 'normal' ? 'simplificada' : 'normal', showChord);
	};

	const renderContent = () =>
		<View
			style={{
				backgroundColor: '#f5f5f5',
				padding: 0,
				height: 200,
			}}
		>
			{allChords.length
				? <ChordTab
						onPressClose={() => {
							selectChord(null);
							handleOpenBootmSheet();
						}}
						selectedChord="Cm"
						allChords={allChords}
						closeLabel="Fechar"
					/>
				: <Text>Nada</Text>}
		</View>;

	return (
		<SafeAreaView style={[styles.containerSafe, { backgroundColor: darkMode ? '#000000' : '#f5f5f5' }]}>
			<View style={[styles.navbar, { backgroundColor: darkMode ? '#000000' : '#f5f5f5' }]}>
				<View style={{ flex: 0.3, backgroundColor: darkMode ? '#000000' : '#f5f5f5' }}>
					{/* {data.numero &&
						<Text style={[styles.descriptionsSong]}>Número: {data.numero || ' '}</Text>} */}

					<Text style={[styles.descriptionsSong, { color: !darkMode ? '#000000' : '#f5f5f5' }]}>
						Toalidade: {data.tom}
					</Text>
					{data.ritmo &&
						<Text style={[styles.descriptionsSong]}>
							Ritmo: {data.ritmo.nome}
						</Text>
					}
				</View>
				<View
					style={{
						flex: 0.7,
						backgroundColor: darkMode ? '#000000' : '#f5f5f5',
						alignItems: 'flex-end',
						right: 0,
					}}
				>
					{!data.letra_simplificada
						? <Text style={[styles.descriptionsSong]}>
								Versão: {version}{' '}
							</Text>
						: <TouchableHighlight onPress={handleChangeVersion}>
								<Text style={[styles.descriptionsSong]}>
									Versão: {version} (Trocar)
								</Text>
						</TouchableHighlight>}
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
							? <HTMLView value={song} stylesheet={styleSheetWebView} />
							: <Text>Letra não encontrada.</Text>}
					</ScrollView>
				</View>

				<View
					style={{
						flex: 0.2,
						right: 0,
						marginRight: -15,
						alignItems: 'center',
						top: '20%',
						width: 25,
						backgroundColor: darkMode ? '#000000' : '#FFFFFF',
					}}
				>
					<TouchableOpacity style={styles.btnUp} onPress={changeTextSizeUp}>
						<Text style={{ fontSize: 14 }}>A+</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.btnDown} onPress={changeTextSizeDown}>
						<Text style={{ fontSize: 14 }}>A-</Text>
					</TouchableOpacity>

					{showChord &&
						<TouchableOpacity style={styles.btnUp} onPress={arrayWalk}>
							<Text style={{ fontSize: 14 }}>
								{getNextTone()}
							</Text>
						</TouchableOpacity>}

					{showChord &&
						<TouchableOpacity style={styles.btnDown} onPress={arrayReverseWalk}>
							<Text style={{ fontSize: 14 }}>
								{getPreviousTone()}
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

					{/* <TouchableOpacity style={styles.btnUp} onPress={handleFavorite}>
						{favorite
							? <Ionicons name="ios-star" color="#ffd000" size={15} />
							: <Ionicons name="ios-star-outline" size={15} />}
					</TouchableOpacity> */}

					<TouchableOpacity style={styles.btnUp} onPress={handleChordColor}>
						<Ionicons name="color-palette-outline" color={getNextChordColor()} size={15} />
					</TouchableOpacity>

					{/* <TouchableOpacity style={styles.btnUp} onPress={handleShowHeader}>
						<Ionicons name="expand-outline" size={15} />
					</TouchableOpacity> */}

					<TouchableOpacity
						style={styles.btnUp}
						onPress={() => {
							handleOpenBootmSheet();
						}}
					>
						<Ionicons name="musical-notes-outline" size={15} />
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.btnUp}
						onPress={() => {
							
							navigation.navigate("LetraEditor", {
								id: data.id,
								title: data.nome
							});

						}}
					>
						<Ionicons name="build-outline" size={15} />
					</TouchableOpacity>

				</View>
			</View>

			{openBottomSheet &&
				<BottomSheet
					ref={sheetRef}
					snapPoints={[200, 200, 0]}
					borderRadius={10}
					renderContent={renderContent}
					enabledContentGestureInteraction={false}
				/>}
		</SafeAreaView>
	);
};

const SecondRoute = ({ data }) => {
	return (
		<ScrollView scrollEnabled>
			<View style={[styles.scene, { backgroundColor: '#FFF', padding: 20 }]}>

				<Text style={styles.descriptionsSong}>
					Autor: {data.autor ? data.autor.nome : 'Não Informado'}
				</Text>

				{data.autor &&
					<Text style={styles.descriptionsSong}>
						Biografia: {data.autor.biografia}
					</Text>}

				<Text style={styles.descriptionsSong}>
					Artista/Cantor: {data.artista ? data.artista.nome : 'Não Informado'}
				</Text>

				{data.artista &&
					<Text style={styles.descriptionsSong}>
						Biografia: {data.artista.biografia}
					</Text>}

				{data.categoria &&
					<Text style={styles.descriptionsSong}>
						Categoria: {data.categoria.nome}
					</Text>}
				{data.categoria &&
					<Text style={styles.descriptionsSong}>
						Coleção: {data.categoria.colecao.nome}
					</Text>}
				<Text style={styles.descriptionsSong}>
					Atualizado Em: {data.created_at ? moment(data.created_at).format('DD/MM/YY hh:mm:ss') : 'Indefinido'}
				</Text>
			</View>
		</ScrollView>
	);
};

const ThirdRoute = ({ data }) => {

	const [downloadProgress, setDownloadProgress] = React.useState(0);

	const callback = downloadProgress => {
		const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
		setDownloadProgress(progress);
	};

	const downloadFile = async (item) => {

		const downloadResumable = FileSystem.createDownloadResumable(
			`http://coletanea-io.umbler.net${item.url}`,
			FileSystem.documentDirectory + item.name,
			{},
			callback
		);

		try {
			const { uri } = await downloadResumable.downloadAsync();
			console.log('Finished downloading to ', uri);
		} catch (e) {
			console.error(e);
		}

	}

	const keyExtractor = (item, index) => index.toString();

	const renderItem = ({ item }) =>
		<ListItem bottomDivider onPress={() => downloadFile(item)}>
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

				{/* <Text style={styles.comments}>Videos</Text>
				{data.videos && data.videos.length > 0
					? <FlatList
							data={data.videos}
							renderItem={({ item }) =>
								<View style={styles.item}>
									<Text style={styles.title}>
										{item.titulo}
									</Text>
									<WebView
										ref={webViewRef}
										style={{flex:1}}
										// style={styles.WebViewContainer}
										scalesPageToFit
										javaScriptEnabled={true}
										domStorageEnabled={true}
										source={{ uri: item.link }}
									/>
								</View>}
							keyExtractor={item => item.id.toString()}
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
		first: () => <FirstRoute data={data} handleShowHeader={handleShowHeader} navigation={navigation} />,
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
	WebViewContainer: {
		marginTop: Platform.OS == 'android' ? 20 : 0,
		width: '100%'
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
