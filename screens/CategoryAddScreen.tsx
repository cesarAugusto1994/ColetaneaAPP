import * as React from 'react';
import { StyleSheet, SafeAreaView, TextInput, View, Alert } from 'react-native';
import api from '../services/api/axios';
import { getToken } from '../services/services/auth';
import { Button, Card } from 'react-native-elements';
import { Block, Text } from 'galio-framework';
import { Picker } from '@react-native-picker/picker';
import _ from 'lodash';

export default function MainScreen({ navigation, route }) {
	const [data, setData] = React.useState([]);

	const [refreshing, setRefreshing] = React.useState(false);
	const [saving, setSaving] = React.useState(false);
	const [order, setOrder] = React.useState();

	const [selectedCollection, setSelectedCollection] = React.useState(route.params.id || undefined);

	const [name, setName] = React.useState(undefined);

	const [numberStart, setNumberStart] = React.useState(undefined);
	const [numberEnd, setNumberEnd] = React.useState(undefined);

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

	const getCollection = async () => {
		setRefreshing(true);
		try {
			const response = await api.get(`colecoes`, {
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

	React.useEffect(() => {
		getCollection()
	}, []);

	const saveSong = async () => {
		try {
			if (!name) {
				Alert.alert("Título Requerido!", 'Informe o Título');
				return;
			}

			const requestData = {
				nome: name,
				colecao_id: selectedCollection,
				ordem: order || '0',
				number_start: numberStart,
				number_end: numberEnd
			};

			setSaving(true);

			const response = await api.post(`categorias`, requestData, {
				headers: {
					Authorization: await getToken(),
				},
			});
			if (response) {
				Alert.alert("Sucesso!", 'Registro atualizado com sucesso!');
				navigation.navigate('Categorias', {
					id: route.params.id,
					reload: true,
				});
				setSaving(false);
			}
		} catch (error) {
			setSaving(false);
			Alert.alert("Erro Inesperado", 'Ocorreu um na atualização!');
			console.log('error', error);
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
				<Block>
					<Text style={styles.linkText}>Coleção</Text>
					<Picker
						selectedValue={selectedCollection}
						style={styles.picker}
						onValueChange={(itemValue, itemIndex) => {
							setSelectedCollection(itemValue);
						}}
					>
						{data.map(colecao =>
							<Picker.Item
								key={colecao.id}
								label={`${colecao.nome}`}
								value={colecao.id}
							/>
						)}
					</Picker>
				</Block>
				<View style={styles.divider} />
				<Block>
					<Text style={styles.linkText}>Ordem</Text>
					<TextInput
						style={styles.textInput}
						placeholder="Ordem de Apresentação"
						defaultValue={order}
						onChangeText={text => setOrder(text)}
					/>
				</Block>
				<View style={styles.divider} />
				<Block>
					<Text style={styles.linkText}>Número de Início</Text>
					<TextInput
						style={styles.textInput}
						placeholder="opcional"
						defaultValue={numberStart}
						onChangeText={text => setNumberStart(text)}
					/>
				</Block>
				<View style={styles.divider} />
				<Block>
					<Text style={styles.linkText}>Número de Fim</Text>
					<TextInput
						style={styles.textInput}
						placeholder="opcional"
						defaultValue={numberEnd}
						onChangeText={text => setNumberEnd(text)}
					/>
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
