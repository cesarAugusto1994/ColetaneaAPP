import * as React from 'react';
import { StyleSheet, SafeAreaView, ScrollView, FlatList, Platform, Dimensions, TouchableOpacity, Alert, Linking } from 'react-native';
import WebView from 'react-native-webview';
import { Ionicons, FontAwesome5, Entypo } from '@expo/vector-icons';
import HTMLView from 'react-native-htmlview';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Card, ListItem, Button } from 'react-native-elements';
import * as Audio from 'expo-av';
import BottomSheet from 'reanimated-bottom-sheet';
import moment from 'moment';
import { TouchableHighlight } from 'react-native-gesture-handler';

import { Text, View } from '../components/Themed';
import api from '../services/api/axios';
import Transposer from '../services/chord-transposer';
import { getToken, getDisplayMode, setDisplayMode } from '../services/services/auth';
import ChordTab from '../components/ChordTab';
import { getUser, setUser } from '../services/services/auth';

import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';

import {
	AdMobBanner as AdMobBannerComponent,
	AdMobInterstitial,
	PublisherBanner as PublisherBannerComponent,
	AdMobRewarded,
	setTestDeviceIDAsync, //
} from 'expo-ads-admob';
import { Ads } from '../components/components';

const _ = require('lodash');

const tones = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];
const colors = ['#fcba03', '#d44b42', '#35d45d', '#3381d4'];

const FirstRoute = ({ data, showHeader, handleShowHeader, navigation, currentUser }) => {

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

	React.useEffect(
		() => {
			if (currentUser) {
				const hasSong = _.findIndex(currentUser.musicas, { id: data.id });
				setFavorite(hasSong > -1);
			}
		},
		[currentUser]
	);

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
		await handleGetVersion(version, showChord, tones[nextIndex]);
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
		await handleGetVersion(version, showChord, tones[nextIndex]);
	};

	React.useEffect(() => {
		handleGetVersion('normal');
		getMode()
	}, []);

	const storeTheme = async () => {
		await setDisplayMode(!darkMode ? 'light' : 'dark')
	}

	React.useEffect(() => {

		storeTheme()
		
	}, [darkMode]);

	const getMode = async () => {
		const mode = await getDisplayMode()
		setDarkMode(mode === 'dark')
	}

	const changeTextSizeDown = () => {
		if (spanFontSize <= 10) return;
		setspanFontSize(spanFontSize - 1);
	};

	const changeTextSizeUp = () => {
		if (spanFontSize >= 36) return;
		setspanFontSize(spanFontSize + 1);
	};

	const handleFavorite = async () => {
		setFavorite(!favorite);

		if (currentUser.musicas) {
			const hasMusica = _.findIndex(currentUser.musicas, { id: data.id });
			if (hasMusica > -1) {
				_.remove(currentUser.musicas, { id: data.id });
			} else {
				currentUser.musicas.push(data);
			}
		}

		try {
			const response = await api.put(
				`users/${currentUser.id}`,
				{
					musicas: currentUser.musicas,
				},
				{
					headers: {
						Authorization: await getToken(),
					},
				}
			);
			if (response) {
				// setData(response.data);
			}
		} catch (error) {
			console.log('error', error.response);
		}

		setUser(currentUser);
	};

	const handleShowChord = async () => {
		setShowChord(!showChord);
		await handleGetVersion(version, !showChord, tom);
	};

	const handleDarkMode = async () => {
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

	const openSpotify = () => {
		Linking.openURL("https://open.spotify.com/track/4OkMK49i3NApR1KsAIsTf6?si=e7cb3f6011174635")
	}

	const bannerError = (error) => {
		// Do something!
	};

	const renderContent = () =>
		<View
			style={{
				backgroundColor: '#f5f5f5',
				padding: 0,
				height: 200,
			}}
		>
			<ChordTab
						onPressClose={() => {
							selectChord(null);
							handleOpenBootmSheet();
						}}
						selectedChord="Cm"
						allChords={allChords}
						closeLabel="Fechar"
					/>
		</View>;

	return (
		<SafeAreaView style={[styles.containerSafe, { backgroundColor: darkMode ? '#000000' : '#f5f5f5' }]}>

			{
				showHeader && (
					<View style={[styles.navbar, { backgroundColor: darkMode ? '#000000' : '#f5f5f5' }]}>
						
						<View style={{ flex: 1, backgroundColor: darkMode ? '#000000' : '#f5f5f5' }}>
							{/* {data.numero &&
								<Text style={[styles.descriptionsSong]}>Número: {data.numero || ' '}</Text>} */}

							<Text style={[styles.descriptionsSong, { color: !darkMode ? '#000000' : '#f5f5f5' }]}>
								Tonalidade: {data && data.tom}
							</Text>
							{data.ritmo &&
								<Text style={[styles.descriptionsSong, { color: !darkMode ? '#000000' : '#f5f5f5' }]}>
									Ritmo: {data.ritmo.nome}
								</Text>}

							{!data.letra_simplificada
								? <Text style={[styles.descriptionsSong, { color: !darkMode ? '#000000' : '#f5f5f5' }]}>
										Versão: {version}{' '}
									</Text>
								: <TouchableHighlight onPress={handleChangeVersion}>
										<Text style={[styles.descriptionsSong, { color: !darkMode ? '#000000' : '#f5f5f5' }]}>
											Versão: {version} (Trocar)
										</Text>
									</TouchableHighlight>}
							{
								data.spotify && (
									<TouchableOpacity onPress={openSpotify} style={styles.earOnSpotify}>
										<Entypo name="spotify" size={24} color="black" />
										<Text style={styles.descriptionsSong}>
											{` `}Ouvir no Spotify
										</Text>
									</TouchableOpacity>
								)
							}
							
						</View>

						{data.videoHash &&
							<WebView
								style={styles.WebViewContainer}
								javaScriptEnabled={true}
								source={{
									uri: `https://www.youtube.com/embed/${data.videoHash}?rel=0&fs=0&autoplay=0&showinfo=0&controls=0`,
								}}
							/>}
					</View>
				)
			}
			

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
					<View>
						{
							<AdMobBannerComponent
								bannerSize="banner" // Banner size (banner | fullBanner | largeBanner | leaderboard | mediumRectangle | smartBannerLandscape | smartBannerPortrait)
								adUnitID={Ads.adUnitID?.banner}
								servePersonalizedAds // true or false
								onDidFailToReceiveAdWithError={bannerError}
							/>
						}
					</View>
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
						height: 450,
						marginRight: -40,
						top: 0,
						width: 25,
						backgroundColor: darkMode ? '#000000' : '#FFFFFF',
					}}
				>

					<ScrollView
						scrollEnabled={true}
					>

					<TouchableOpacity style={styles.btnUp} onPress={handleShowHeader}>
						<Ionicons name="expand-outline" size={15} />
					</TouchableOpacity>

					<TouchableOpacity style={darkMode ? styles.btnUpDark : styles.btnUp} onPress={changeTextSizeUp}>
						<Text style={darkMode ? styles.textLight : styles.textDark}>A+</Text>
					</TouchableOpacity>

					<TouchableOpacity style={darkMode ? styles.btnDownDark : styles.btnDown} onPress={changeTextSizeDown}>
						<Text style={darkMode ? styles.textLight : styles.textDark}>A-</Text>
					</TouchableOpacity>

					<TouchableOpacity style={darkMode ? styles.btnUpDark : styles.btnUp} onPress={handleShowChord}>
						{!showChord
							? <FontAwesome5 name="guitar" size={15} color={darkMode? '#FFF' : '#333'} />
							: <Ionicons name="ios-document-text-outline" size={15} color={darkMode? '#FFF' : '#333'} />}
					</TouchableOpacity>

					{
						showHeader && (

						<>

							{showChord &&
								<TouchableOpacity style={darkMode ? styles.btnUpDark : styles.btnUp} onPress={arrayWalk}>
									<Text style={darkMode ? styles.textLight : styles.textDark}>
										{getNextTone()}
									</Text>
								</TouchableOpacity>}

							{showChord &&
								<TouchableOpacity style={darkMode ? styles.btnDownDark : styles.btnDown} onPress={arrayReverseWalk}>
									<Text style={darkMode ? styles.textLight : styles.textDark}>
										{getPreviousTone()}
									</Text>
								</TouchableOpacity>}

							<TouchableOpacity style={darkMode ? styles.btnUpDark : styles.btnUp} onPress={handleDarkMode}>
								{darkMode
									? <Ionicons name="sunny-outline" size={15} color={darkMode? '#FFF' : '#333'} />
									: <Ionicons name="moon-outline" size={15} color={darkMode? '#FFF' : '#333'} />}
							</TouchableOpacity>

							

							<TouchableOpacity style={darkMode ? styles.btnUpDark : styles.btnUp} onPress={handleFavorite}>
								{favorite
									? <Ionicons name="ios-star" color="#ffd000" size={15} />
									: <Ionicons name="ios-star-outline" size={15} color={darkMode? '#FFF' : '#333'} />}
							</TouchableOpacity>

							<TouchableOpacity style={darkMode ? styles.btnUpDark : styles.btnUp} onPress={handleChordColor}>
								<Ionicons name="color-palette-outline" color={getNextChordColor()} size={15} />
							</TouchableOpacity>

							

							{data.letra &&
								<TouchableOpacity
									style={darkMode ? styles.btnUpDark : styles.btnUp}
									onPress={() => {
										handleOpenBootmSheet();
									}}
								>
									<Ionicons name="musical-notes-outline" size={15} color={darkMode? '#FFF' : '#333'} />
								</TouchableOpacity>}

								<TouchableOpacity
									style={darkMode ? styles.btnUpDark : styles.btnUp}
									onPress={() => {
										navigation.navigate('LetraEditor', {
											id: data.id,
											title: data.nome,
										});
									}}
								>
									<Ionicons name="build-outline" size={15} color={darkMode? '#FFF' : '#333'} />
								</TouchableOpacity>

							</>

						)
					}
					

						</ScrollView>
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
		<ScrollView scrollEnabled style={{backgroundColor: '#f5f5f5',}}>
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

				{data.categoria_id &&
					<Text style={styles.descriptionsSong}>
						Categoria: {data.categoria_id.nome}
					</Text>}
				<Text style={styles.descriptionsSong}>
					Atualizado Em:{' '}
					{data.created_at ? moment(data.created_at).format('DD/MM/YY hh:mm:ss') : 'Indefinido'}
				</Text>
			</View>
		</ScrollView>
	);
};

const ThirdRoute = ({ data, currentUser }) => {
	
	const [downloadProgress, setDownloadProgress] = React.useState(0);
	const [saving, setSaving] = React.useState(false);
	const [sound, setSound] = React.useState();
	const [isPlaying, setIsPlaying] = React.useState(false);
	const [isDownloading, setIsDownloading] = React.useState(false);
	const [uploadingProgress, setUploadingProgress] = React.useState(0)

	const pickDocument = async () => {
		let result = await DocumentPicker.getDocumentAsync({
			type: 'application/pdf',
			copyToCacheDirectory: true,
			multiple: true
		});

		if (result.type === 'success' ) {
			uploadFile(result, 'application/pdf');
		}

	};

	const pickSong = async () => {
		let result = await DocumentPicker.getDocumentAsync({
			type: 'audio/mpeg',
			copyToCacheDirectory: true,
			multiple: true
		});

		if (result.type === 'success' ) {
			uploadFile(result, 'audio/mpeg');
		}

	};

	const onUploadProgress = uploading => {
		const percentage = (uploading.loaded / uploading.total) * 100
		setUploadingProgress(percentage.toFixed(2))
	}

	const uploadFile = async (file, type) => {
		try {
			setSaving(true);

			const form = new FormData();

			const newImageUri =  "file:///" + file.uri.split("file:/").join("");

			form.append('files', {
				uri: newImageUri,
				name: `${file.name}`,
				type: type,
			}); 

			form.append('ref', 'musicas')
			form.append('refId', data.id)
			form.append('field', 'anexos')

			const response = await api.post('upload', form, {
				headers: {
					Accept: 'application/json',
					Authorization: await getToken(),
					'Content-Type': 'multipart/form-data',
				},
				onUploadProgress
			});
			if (response) {
				Alert.alert('Envio do arquivo','Arquivo enviado com Sucesso');

				const attechments = data.anexos || [];
				const song = data
				attechments.push(response.data[0])
				song.anexos = attechments
			}
			setSaving(false);
		} catch (error) {
			setSaving(false);
			console.log('error', error.message);
			console.log('error', error.config);
			Alert.alert('Envio do arquivo','Ocorreu algum erro no tentar enviar o arquivo, tente novamente.');
		}
	};

	const requestDeleteFile = item => {

		Alert.alert(
			"Deletar arquivo?",
			"ao deletar, não será possivel recuperar o arquivo!",
			[
			  {
				text: "Cancelar",
				onPress: () => {},
				style: "cancel"
			  },
			  { text: "Sim", onPress: () => deleteFile(item) }
			]
		  );

	}

	const deleteFile = async item => {
		try {
			setSaving(true);
			const response = await api.delete(
				`upload/files/${item.id}`,
				{
					headers: {
						Authorization: await getToken(),
					},
				}
			);
			if (response && response.data) {
				Alert.alert('Deletar arquivo', 'Arquivo deletado com Sucesso');

				_.remove(data.anexos, removedItem => removedItem.id === item.id)

			}
			setSaving(false);
		} catch (error) {
			setSaving(false);
			console.log('error', error.response);
		}
	};

	const uploadSong = async newSong => {
		try {
			setSaving(true);

			const attechments = data.anexos || [];
			const song = data
			attechments.push(newSong)

			song.anexos = attechments

			const response = await api.put(
				`musicas/${data.id}`,
				JSON.stringify(song),
				{
					headers: {
						Authorization: await getToken(),
					},
				}
			);
			if (response && response.data) {
				// alert('Sucesso');
			}
			setSaving(false);
		} catch (error) {
			setSaving(false);
			console.log('error', error.response);
		}
	};

	const callback = downloadProgress => {
		setIsDownloading(true)
		const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
		setDownloadProgress(progress);
	};

	const saveFile = async (fileUri: string) => {

		try {
			const { status } = await MediaLibrary.requestPermissionsAsync();
			if (status === 'granted') {
				const asset = await MediaLibrary.createAssetAsync(fileUri);
				const dewnloded = await MediaLibrary.createAlbumAsync('Minha Coletânea', asset, false);
				if (dewnloded) {
					Alert.alert("Arquivo baixado",'Arquivo baixado com sucesso na Pasta Minha Coletânea');
				}
			}
		} catch(error) {
			console.log(error)
			Alert.alert("Baixar arquivo", 'ocorreu um erro ao tentar baixar o arquivo.')
		}
	};

	const requestDownloadFile = item => {

		Alert.alert(
			"Baixar arquivo?",
			"Ao baixar, o arquivo estará disponível na pasta Minha Coletanea do seu dispositivo.",
			[
			  {
				text: "Cancelar",
				onPress: () => {},
				style: "cancel"
			  },
			  { text: "Sim", onPress: () => downloadFile(item) }
			]
		  );

	}

	const downloadFile = async item => {

		// const url = `http://192.168.15.29:1337${item.url}`

		try {

			const downloadResumable = FileSystem.createDownloadResumable(
				item.url,
				FileSystem.documentDirectory + item.name,
				{},
				callback
			);

			const { uri } = await downloadResumable.downloadAsync();
			saveFile(uri);

			if(downloadProgress === 1) {
				setIsDownloading(false)
				setDownloadProgress(0)
			}

		} catch (e) {
			console.error(e);
		}
	};

	const fileCanBePlayed = item => {
		return ["audio/mpeg"].includes(item.mime)
	}

	async function playSound(item) {
		const { sound } = await Audio.Audio.Sound.createAsync({uri: item.url});
		// const { sound } = await Audio.Audio.Sound.createAsync({uri: `http://192.168.15.29:1337${item.url}`});
		setIsPlaying(true)
		setSound(sound);
		await sound.playAsync(); 
	}

	async function stopSound() {
		if(sound) {
			await sound.stopAsync(); 
			setIsPlaying(false)
		}
	}
	
	React.useEffect(() => {
	return sound
		? () => {
			sound.unloadAsync(); }
		: undefined;
	}, [sound]);

	const keyExtractor = (item, index) => index.toString();

	const renderItem = ({ item }) =>
		<ListItem bottomDivider>
			<ListItem.Content>
				<ListItem.Title>
					{item.name}
				</ListItem.Title>
				<ListItem.Subtitle>
					Tam: {item.size} kbs
				</ListItem.Subtitle>
				<View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>

					<View style={{flexDirection: 'row', marginVertical: 10}}>

						<Button
							title="Baixar"
							type="outline"
							onPress={() => requestDownloadFile(item)}
							containerStyle={{marginRight: 10}}
						/>

						{
							fileCanBePlayed(item) && (
								<Button
									title={isPlaying ? 'Pausar' : 'Play'}
									onPress={() => isPlaying ? stopSound() : playSound(item)}
								/>
							)
						}

					</View>

					<View>

						{
							(currentUser && currentUser.role && currentUser.role.id === 3) && (
								<Button
									title="Deletar"
									type="clear"
									onPress={() => requestDeleteFile(item)}
									titleStyle={{color: 'red'}}
								/>
							)
						}

					</View>
				
				</View>
			</ListItem.Content>
		</ListItem>;

	return (
		<SafeAreaView style={styles.containerSafe}>
			<View style={[styles.scene, { backgroundColor: '#fafafa' }]}>
				{data.anexos && data.anexos.length > 0
					? <FlatList data={data.anexos} renderItem={renderItem} keyExtractor={keyExtractor} />
					: <View style={styles.notfound}>
							<Card.Title style={styles.notfoundTitle}>NENHUM ARQUIVO ENCONTRADO.</Card.Title>
							<Card.Divider />
						</View>}

				{
					(currentUser && currentUser.role && currentUser.role.id === 3) && (
						<View style={{flexDirection:'row'}}>
							<Button title="Enviar Documento" onPress={pickDocument} containerStyle={styles.buttonSendFile} />
							<Button title="Enviar mp3" onPress={pickSong} buttonStyle={{backgroundColor: 'crimson'}} containerStyle={styles.buttonSendSong} />
						</View>
					)
				}

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
				{
					isDownloading && downloadProgress < 1 && (
						<View style={styles.downloadContainer}>
							<Text>Baixando: {(downloadProgress*100).toFixed(2)}%</Text>
						</View>
					)
				}

				{
					uploadingProgress > 0 && uploadingProgress < 100 && (
						<View style={styles.downloadContainer}>
							<Text>Enviando arquivo: {uploadingProgress}%</Text>
						</View>
					)
				}
				
			</View>

		</SafeAreaView>
	);
};

const initialLayout = { width: Dimensions.get('window').width };

export default function SongScreen({ route, navigation }) {
	const [data, setData] = React.useState({});
	const [showHeader, setShowHeader] = React.useState(true);
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

	React.useEffect(() => {
		navigation.setOptions({
			headerShown: showHeader,
		});
	}, [showHeader]);

	React.useEffect(
		() => {
			if (currentUser && currentUser.role && data) {
				navigation.setOptions({
					headerRight: () =>
						<TouchableHighlight
							style={{ marginRight: 15 }}
							onPress={() => {
								navigation.navigate('SongEditor', {
									id: data.id,
								});
							}}
						>
							<Ionicons name="ios-settings-outline" size={25} color="#d44b42" />
						</TouchableHighlight>,
				});
			}
		},
		[currentUser, data]
	);

	React.useEffect(
		() => {
			if (route.params && route.params.reload) {
				getSong();
			}
		},
		[route.params]
	);

	const handleShowHeader = () => {
		setShowHeader(!showHeader);
	};

	function youtubeParser(url) {
		var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
		var match = url.match(regExp);
		return match && match[7].length == 11 ? match[7] : false;
	}

	const getSong = async () => {
		try {
			const response = await api.get(`musicas/${route.params.id}`, {
				headers: {
					Authorization: await getToken(),
				},
			});
			if (response) {
				if (response.data.video) {
					const ytb = youtubeParser(response.data.video);
					response.data.videoHash = ytb;
				}

				setData(response.data);
			}
		} catch (error) {
			console.log('error', JSON.stringify(error));
		}
	};

	React.useEffect(() => {
		getSong();
	}, []);

	const [index, setIndex] = React.useState(0);
	const [routes] = React.useState([
		{ key: 'first', title: 'Letra' },
		{ key: 'second', title: 'Info.' },
		{ key: 'third', title: 'Mídias' },
	]);

	const renderScene = SceneMap({
		first: () =>
			<FirstRoute
				data={data}
				handleShowHeader={handleShowHeader}
				showHeader={showHeader}
				navigation={navigation}
				currentUser={currentUser}
			/>,
		second: () => <SecondRoute data={data} currentUser={currentUser} />,
		third: () => <ThirdRoute data={data} currentUser={currentUser} />,
	});

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
		backgroundColor: '#f5f5f5',
	},
	WebViewContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#ecf0f1',
		height: 350,
		width: '100%',
	},
	navbar: { flexDirection: 'row', width: '100%', padding: 10 },
	title: {
		fontSize: 14,
	},
	scene: {
		flex: 1,
		backgroundColor: '#f5f5f5',
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
		color: '#333'
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
	btnDownDark: {
		padding: 10,
		paddingHorizontal: 10,
		margin: 3,
		backgroundColor: '#333',
		borderRadius: 5,
	},
	btnUp: {
		padding: 10,
		paddingHorizontal: 10,
		margin: 3,
		backgroundColor: '#f5f5f5',
		borderRadius: 5,
	},
	btnUpDark: {
		padding: 10,
		paddingHorizontal: 10,
		margin: 3,
		backgroundColor: '#333',
		borderRadius: 5,
	},
	comments: {
		alignSelf: 'center',
		fontSize: 20,
		fontWeight: 'bold',
	},
	textLight: {
		color: 'white',
		fontSize: 14
	},
	textDark: {
		color: '#333',
		fontSize: 14
	},
	buttonSendFile: {
		marginHorizontal: 10,
		marginVertical: 30,
		flex: 0.5
	},
	buttonSendSong: {
		marginHorizontal: 10,
		marginVertical: 30,
		flex: 0.5,
	},
	downloadContainer: {
		marginHorizontal: 10,
		alignItems: 'center',
	},
	uploadContainer: {
		marginHorizontal: 10,
		alignItems: 'center',
	},
	earOnSpotify: {
		flexDirection: 'row',
		paddingVertical: 5,
		alignItems: 'center'
	}
});
