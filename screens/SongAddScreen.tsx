import * as React from 'react';
import { StyleSheet, SafeAreaView, TextInput, View, Alert } from 'react-native';
import api from '../services/api/axios';
import { getToken } from '../services/services/auth';
import { Button, Card } from 'react-native-elements';
import { Block, Text } from 'galio-framework';
import { Picker } from '@react-native-picker/picker';
import _ from 'lodash';

const tones = [
	'C',
	'Cm',
	'C#',
	'C#m',
	'D',
	'Dm',
	'D#',
	'D#m',
	'Db',
	'Dbm',
	'E',
	'Em',
	'Eb',
	'Ebm',
	'F',
	'Fm',
	'F#',
	'F#m',
	'G',
	'Gm',
	'G#',
	'G#m',
	'Gb',
	'Gbm',
	'A',
	'Am',
	'A#',
	'A#m',
	'Ab',
	'Abm',
	'B',
	'Bm',
	'Bb',
	'Bbm',
];

export default function MainScreen({ navigation, route }) {
	const [data, setData] = React.useState(null);
	const [categories, setCategories] = React.useState([]);
	const [rhythms, setRhythms] = React.useState([]);

	const [refreshing, setRefreshing] = React.useState(false);
	const [saving, setSaving] = React.useState(false);

	const [selectedCategory, setSelectedCategory] = React.useState(route.params.id || undefined);
	const [selectedRhythm, setSelectedRhythm] = React.useState(undefined);

	const [name, setName] = React.useState(undefined);
	const [tom, setTom] = React.useState(undefined);
	const [number, setNumber] = React.useState(undefined);

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

	const getSong = async () => {
		setRefreshing(true);
		try {
			const response = await api.get(`musicas/${route.params.id}`, {
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
			console.log('error', JSON.stringify(error));
		}
	};

	const getCategories = async () => {
		setRefreshing(true);
		try {
			const response = await api.get(`categorias`, {
				headers: {
					Authorization: await getToken(),
				},
			});
			if (response) {
				setCategories(_.sortBy(response.data, 'colecao_id.id'));
				setRefreshing(false);
			}
		} catch (error) {
			setRefreshing(false);
			console.log('error', JSON.stringify(error));
		}
	};

	const getRhythms = async () => {
		setRefreshing(true);
		try {
			const response = await api.get(`ritmos`, {
				headers: {
					Authorization: await getToken(),
				},
			});
			if (response) {
				setRhythms(_.sortBy(response.data, 'nome'));
				setRefreshing(false);
			}
		} catch (error) {
			setRefreshing(false);
			console.log('error', JSON.stringify(error));
		}
	};

	React.useEffect(() => {
		getSong();
		getCategories();
		getRhythms();
	}, []);

	const saveSong = async () => {
		try {
			if (!name) {
				Alert.alert("Título Requerido!", 'Informe o Título');
				return;
			}

			const requestData = {
				nome: name,
				tom: tom,
				categoria_id: selectedCategory,
				ritmo: selectedRhythm,
				numero: number,
			};

			setSaving(true);

			const response = await api.post(`musicas`, requestData, {
				headers: {
					Authorization: await getToken(),
				},
			});
			if (response && response.data) {
				Alert.alert("Sucesso!", 'Registro atualizado com sucesso!');
				navigation.navigate('Musica', {
					id: response.data.id,
					title: response.data.nome,
					reload: true,
				});
				setSaving(false);
			}
		} catch (error) {
			setSaving(false);
			Alert.alert("Erro Inesperado", 'Ocorreu um na atualização!');
			console.log('error', error.response);
		}
	};

	if (refreshing)
		return (
			<View style={styles.notfound}>
				<Card.Title style={styles.notfoundTitle}>Carregando Conteúdo...</Card.Title>
				<Card.Divider />
			</View>
		);

	return (
		<SafeAreaView style={styles.container}>
			<Block flex style={{ width: '100%' }}>
				<Block>
					<Text style={styles.linkText}>Titulo</Text>
					<TextInput
						style={styles.textInput}
						placeholder="Titulo"
						defaultValue={name}
						onChangeText={text => setName(text)}
					/>
				</Block>
				<View style={styles.divider} />
				{/* <Block>
					<Text style={styles.linkText}>Tonalidade</Text>
					<TextInput
						style={styles.textInput}
						placeholder="Tonalidade"
						defaultValue={tom}
						onChangeText={text => setTom(text)}
					/>
				</Block> */}
				<View style={styles.divider} />
				<Block>
					<Text style={styles.linkText}>Número</Text>
					<TextInput
						style={styles.textInput}
						placeholder="Número (se Houver)"
						defaultValue={number}
						onChangeText={text => setNumber(text)}
					/>
				</Block>
				<View style={styles.divider} />
				<Block>
					<Text style={styles.linkText}>Tonalidade</Text>
					<Picker
						selectedValue={tom}
						style={styles.picker}
						onValueChange={(itemValue, itemIndex) => {
							setTom(itemValue);
						}}
					>
						{tones.map(tone => <Picker.Item key={tone} label={tone} value={tone} />)}
					</Picker>
				</Block>
				<View style={styles.divider} />
				<Block>
					<Text style={styles.linkText}>Categoria</Text>
					<Picker
						selectedValue={selectedCategory}
						style={styles.picker}
						onValueChange={(itemValue, itemIndex) => {
							setSelectedCategory(itemValue);
						}}
					>
						{categories.map(category =>
							<Picker.Item
								key={category.id}
								label={`${category.colecao_id && category.colecao_id.nome}: ${category.nome}`}
								value={category.id}
							/>
						)}
					</Picker>
				</Block>

				<View style={styles.divider} />
				<Block>
					<Text style={styles.linkText}>Ritmo</Text>
					<Picker
						selectedValue={selectedRhythm}
						style={styles.picker}
						onValueChange={(itemValue, itemIndex) => {
							setSelectedRhythm(itemValue);
						}}
					>
						{rhythms.map(rhythm => <Picker.Item key={rhythm.id} label={rhythm.nome} value={rhythm.id} />)}
					</Picker>
				</Block>
				<View style={styles.divider} />
				<Block>
					<Button title="Salvar" onPress={saveSong} loading={saving} />
				</Block>
			</Block>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	// container: {
	// 	flex: 1,
	// 	backgroundColor: '#f5f5f5',
	// },
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		// justifyContent: 'center',
		padding: 20,
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
	picker: {
		backgroundColor: '#f5f5f5',
	},
	scrollView: {
		flex: 1,
		width: '100%',
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
		fontSize: 14,
		fontWeight: 'bold',
	},
	linkText: {
		fontSize: 15,
		color: '#333',
		alignContent: 'center',
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
		backgroundColor: '#f5f5f5',
		padding: 12,
		marginVertical: 8,
		marginHorizontal: 16,
	},
});
