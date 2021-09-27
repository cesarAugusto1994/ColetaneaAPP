import React, { memo, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import Container from '../Container';
import { Card } from '../../../components/components';
import { useNavigation } from '@react-navigation/native';
import { SCREENS } from '../../../constants';

const Index = ({ recents, songs, style = {} }) => {
	const { navigate } = useNavigation();
	const [audios, setAudios] = useState([]);

	const handlePress = (song, index) => {

		console.log({song, index})

		if(index >= 0) {
			navigate(SCREENS.PLAYING, {
				forcePlay: true,
				song,
				index,
			});
		}
	};

	useEffect(() => {
		setAudios(recents);
	}, [recents]);

	return (
		audios &&
		audios.length > 0 && (
			<Container style={style} title="Tocadas Recentemente">
				{audios.map((index, key) => (
					<Card.Recent
						key={key}
						style={[key === 0 && { marginLeft: 20 }]}
						imageURL={songs[index]?.img}
						title={songs[index]?.title}
						author={songs[index]?.author}
						onPress={() => handlePress(songs[index], index)}
					/>
				))}
			</Container>
		)
	);
};

const mapStateToProps = (state) => ({ songs: state?.player?.songs, recents: state?.storage?.recents });
export default connect(mapStateToProps, null)(memo(Index));

const styles = StyleSheet.create({});
