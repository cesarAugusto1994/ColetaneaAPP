import * as React from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput, Platform } from 'react-native';
import { Avatar, Button, Card } from 'react-native-elements';
import { Block, theme, Text } from 'galio-framework';
import { getUser, getToken, setUser } from '../services/services/auth';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/api/axios';
import FormData from 'form-data';
import * as ImageManipulator from 'expo-image-manipulator';

export default function UserEditScreen({ navigation }) {
	const [currentUser, setCurrentUser] = React.useState(null);

	const [saving, setSaving] = React.useState(false);
	const [name, setName] = React.useState(null);

	const [image, setImage] = React.useState(null);
	const [image64, setImage64] = React.useState(null);

	React.useEffect(() => {
		(async () => {
			if (Platform.OS !== 'web') {
				const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
				if (status !== 'granted') {
					alert('Sorry, we need camera roll permissions to make this work!');
				}
				// await ImagePicker.requestCameraPermissionsAsync()
				// await ImagePicker.getCameraPermissionsAsync()
			}
		})();
	}, []);

	const handleSaving = () => {
		setSaving(!saving)
	}

	const getCurrentUser = async () => {
		const parseUser = await getUser();
		setCurrentUser(JSON.parse(parseUser));
	};

	React.useEffect(() => {
		getCurrentUser();
	}, []);

	React.useEffect(
		() => {
			if (currentUser) {
				setName(currentUser.username);
				console.log(`http://coletanea-io.umbler.net${currentUser.avatar.url}`)
				setImage(`http://coletanea-io.umbler.net${currentUser.avatar.url}`);
			}
		},
		[currentUser]
	);

	const transforImage = async uri => {
		const manipResult = await ImageManipulator.manipulateAsync(uri, [], {
			format: ImageManipulator.SaveFormat.PNG,
		});
		return manipResult;
	};

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});
		if (!result.cancelled) {
			const manipulatedImage = await transforImage(result.uri);
			setImage(manipulatedImage.uri);
			setImage64(manipulatedImage);
		}
	};

	const save = async () => {
		try {

			setSaving(true)

			const form = new FormData();

			form.append('files', {
				uri: image,
				name: `avatar-user-${currentUser.id}.png`,
				type: `image/png`,
			});

			const response = await api.post(`upload`, form, {
				headers: {
					Authorization: await getToken(),
					// Accept: 'application/json',
					'Content-Type': 'multipart/form-data',
					// mimeType: "multipart/form-data"
				},
			});
			console.log("asdgr", response.data)
			if (response && response.data) {
				alert('Sucesso');
				currentUser.avatar =
					response.data && Array.isArray(response.data) ? response.data[0].id : response.data.id;
				currentUser.username = name;
				updateUser(currentUser);
				return
			} 
			setSaving(false)
		} catch (error) {
			setSaving(false)
			console.log('error', error.config);
		}
	};

	const updateUser = async user => {
		try {
			const response = await api.put(
				`users/${user.id}`,
				{
					username: user.username,
					avatar: user.avatar,
				},
				{
					headers: {
						Authorization: await getToken(),
					},
				}
			);
			if (response) {
				setUser(response.data);
				setSaving(false)
			}
		} catch (error) {
			setSaving(false)
			console.log('error', error.response);
		}
	};

	return (
		<View style={styles.container}>
			{currentUser &&
				<Block flex style={{ width: '100%' }}>
					<Block style={{ alignSelf: 'center' }}>
						<Avatar
							rounded
							size="xlarge"
							containerStyle={{ backgroundColor: '#f5f5f5' }}
							activeOpacity={0.7}
							imageProps={{ resizeMode: 'cover' }}
							onPress={pickImage}
							source={{
								uri:
									image ||
									'https://cdn.pixabay.com/photo/2018/10/30/16/06/water-lily-3784022__340.jpg',
							}}
						/>
					</Block>

					<Block>
						<Text style={styles.linkText}>Nome</Text>
						<TextInput
							style={styles.textInput}
							placeholder="Editar seu Nome"
							defaultValue={currentUser.username}
							onChangeText={text => setName(text)}
						/>
					</Block>

					<View style={styles.divider} />

					<Block flex>
						<Button title="Salvar" onPress={save} loading={saving} />
					</Block>
					<View style={styles.divider} />
				</Block>}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		// justifyContent: 'center',
		padding: 20,
	},
	textInput: {
		width: '100%',
		backgroundColor: '#f5f5f5',
		padding: 5,
	},
	divider: {
		marginVertical: 15,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#333',
	},
	link: {
		marginTop: 15,
		paddingVertical: 15,
	},
	linkText: {
		fontSize: 15,
		color: '#333',
		alignContent: 'center',
	},
});
