import * as React from 'react';
import { StyleSheet, Alert, View, TextInput, Platform } from 'react-native';
import { Avatar, Button } from 'react-native-elements';
import { Block, Text } from 'galio-framework';
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
	const [updateImage, setUpdateImage] = React.useState(false);
	const [image64, setImage64] = React.useState(null);

	React.useEffect(() => {
		(async () => {
			if (Platform.OS !== 'web') {
				const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
				if (status !== 'granted') {
					alert('Sorry, we need camera roll permissions to make this work!');
				}
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
				setName(currentUser.name);
				if(currentUser.avatar) {
					setImage(currentUser.avatar.url);
				}
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
			setUpdateImage(true)
		}
	};

	const save = async () => {
		try {

			setSaving(true)

			if(!updateImage) {
				updateUser()
				return
			}

			const form = new FormData();

			form.append('files', {
				uri: image,
				name: `avatar-user-${currentUser.id}.png`,
				type: `image/png`,
			}); 

			const response = await api.post(`upload`, form, {
				headers: {
					Authorization: await getToken(),
					'Content-Type': 'multipart/form-data',
				},
			});
			if (response && response.data) {
				currentUser.avatar =
					response.data && Array.isArray(response.data) ? response.data[0].id : response.data.id;
				currentUser.name = name;
				updateUser();
				return
			} 
			setSaving(false)
		} catch (error) {
			setSaving(false)
			console.log('error', error.response);
		}
	};

	const updateUser = async () => {
		try {
			const response = await api.put(
				`users/${currentUser.id}`,
				{
					name,
					avatar: currentUser.avatar,
				},
				{
					headers: {
						Authorization: await getToken(),
					},
				}
			);
			if (response) {
				Alert.alert('Sucesso', 'Informações salvas com sucesso.');
				setUser(response.data);
				setSaving(false)
				navigation.goBack()
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
							containerStyle={{ backgroundColor: '#f5f5f5', marginBottom: 10 }}
							activeOpacity={0.7}
							imageProps={{ resizeMode: 'cover' }}
							onPress={pickImage}
							source={{
								uri:
									image ||
									'https://cdn.pixabay.com/photo/2018/10/30/16/06/water-lily-3784022__340.jpg',
							}}
						/>
						<Button size="small" type="outline" title="Editar Imagem" onPress={pickImage} style={{alignSelf: 'flex-end', right: 0}} />
					</Block>

					<View style={styles.divider} />

					<Block>
						<Text style={styles.linkText}>Nome</Text>
						<TextInput
							style={styles.textInput}
							placeholder="Editar seu Nome"
							defaultValue={currentUser.name}
							onChangeText={text => setName(text)}
						/>
					</Block>

					<View style={styles.divider} />

					<Block>
						<Text style={styles.linkText}>Usuário</Text>
						<TextInput
							style={styles.textInput}
							defaultValue={currentUser.username}
							editable={false}
						/>
					</Block>

					<View style={styles.divider} />

					<Block>
						<Text style={styles.linkText}>E-mail</Text>
						<TextInput
							style={styles.textInput}
							defaultValue={currentUser.email}
							editable={false}
						/>
					</Block>

					<View style={styles.divider} />

					<Block>
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
		marginVertical: 10,
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
		color: '#595858',
		alignContent: 'center',
	},
});
