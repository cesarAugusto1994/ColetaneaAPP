import React, { useState, useEffect } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAssets } from 'expo-asset';
import { connect, useDispatch } from 'react-redux';

import { Header, Section, Drawer } from '../../../widgets';
import { Icon } from '../../../components/components';
import { playerActions } from '../../../store/reducers/player/player';

const Index = ({ songs }) => {
	const [assets] = useAssets([require('../../../assets/player/icons/hamburger.png'), require('../../../assets/player/icons/search.png')]);
	const [drawer, setDrawer] = useState(false);

	const dispatch = useDispatch()

	useEffect(() => {

		dispatch(playerActions.player())

	}, [])

	return (
		<Drawer active={drawer} current="songs" onItemPressed={() => setDrawer(false)}>
			<SafeAreaView style={styles.container}>
				<Header
					options={{
						left: {
							children: drawer ? <Icon name="x" color="#C4C4C4" /> : <Image source={require('../../../assets/player/icons/hamburger.png')} resizeMode="contain" />,
							onPress: () => setDrawer(!drawer),
						},
						middle: {
							show: true,
							text: 'Todas as mídias',
						},
						right: {
							show: false,
						},
					}}
				/>
				<View style={styles.sections}>
					<Section.MusicList audios={songs} indicator={false} />
				</View>
			</SafeAreaView>
		</Drawer>
	);
};

const mapStateToProps = (state) => ({ songs: state?.player?.songs });
export default connect(mapStateToProps, null)(Index);

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	sections: {
		flex: 1,
		marginTop: Dimensions.get('screen').height * 0.025,
	},
});
