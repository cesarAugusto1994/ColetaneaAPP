import React, { useEffect } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { useAssets } from 'expo-asset';
import { connect } from 'react-redux';

import { DISPATCHES, SCREENS } from '../../constants';
import { Storage } from '../../helpers';
import { Ads } from '../../components/components';
import { playerActions } from '../../store/reducers/player/player';

const { width, height } = Dimensions.get('screen');

const Loading = ({ songs, dispatch, navigation: { replace } }) => {
	
	const getStorage = () => {
		return new Promise(async (resolve, reject) => {

			const favourites = await Storage.get('favourites', true);
			const recents = await Storage.get('recents', true);
			const playlists = await Storage.get('playlists', true);

			dispatch({
				type: DISPATCHES.STORAGE,
				payload: {
					favourites,
					recents,
					playlists,
				},
			});

			dispatch(playerActions.player())

			if (recents && recents.length > 0) {

				const current = recents[0]

				if(current >= 0) {
					dispatch(playerActions.playerSetCurrentSong({
						detail: songs[current],
					}));
				}

				// dispatch({
				// 	type: DISPATCHES.SET_CURRENT_SONG,
				// 	payload: {
				// 		detail: songs[recents[0]],
				// 	},
				// });
			}

			await Ads.interstitialAds();
			resolve();
		});
	};

	const init = async () => {
		await getStorage();
		replace(SCREENS.HOME);
	};

	useEffect(() => {
		init();
	}, []);

	return (
		<View style={styles.container}>
			<Text>Carregando..., por favor aguarde.</Text>
		</View>
	)

	// return <Image style={styles.img} source={require('../../assets/player/icons/hamburger.png')} resizeMode="cover" />;
};

const mapStateToProps = (state) => ({ songs: state?.player?.songs });
const mapDispatchToProps = (dispatch) => ({ dispatch });
export default connect(mapStateToProps, mapDispatchToProps)(Loading);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	img: {
		width,
		height,
	},
});
