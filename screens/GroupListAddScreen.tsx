import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import {
	StyleSheet,
	SafeAreaView,
	Dimensions,
	Text,
} from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import { View } from '../components/Themed';
import { getToken } from '../services/services/auth';
import api from '../services/api/axios';
import MultiSelect from 'react-native-multiple-select';
import moment from 'moment';
// Galio components
import { Block, theme } from 'galio-framework';
// Argon themed components
import { Input } from '../components/galio/';
import * as _ from 'lodash';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width } = Dimensions.get('screen');

const Item = ({ title }) =>
	<View style={styles.item}>
		<Text style={styles.title}>
			{title}
		</Text>
	</View>;

export default function GroupScreen({ navigation, route }) {
	const [data, setData] = React.useState([]);
	const [loading, setLoading] = React.useState(false);
	const [showDatePicker, setDatePicker] = React.useState(false);
	const [refreshing, setRefreshing] = React.useState(false);
	const [selectedItems, setSelectedItems] = React.useState([]);
	const [date, setDate] = React.useState(moment());
	const [selectedValue, setselectedValue] = React.useState('culto');
	const [items, setItems] = React.useState([]);
	const [selectedSongs, setSelectedSongs] = React.useState([]);

	const multiSelect = React.useRef(null);

	React.useEffect(() => {
		navigation.setOptions({
			title: 'Nova Lista',
			headerTintColor: '#d44b42',
			headerStyle: {
				borderBottomWidth: 0,
			},
			headerTitleStyle: {
				fontSize: 18,
			},
		});
	}, []);

	const onRefresh = React.useCallback(() => {
		getCollections();
	}, []);

	const getCollections = async () => {
		setRefreshing(true);
		try {
			const response = await api.get(`grupo-listas`, {
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
			console.log('error', JSON.stringify(error.config));
		}
	};

	React.useEffect(() => {
		getCollections();
	}, []);

	const getSongs = async text => {
		try {
			const response = await api.get(`/musicas/search/${text}`);
			if (response) {

				const prepareddata = response.data.map(i => {
					return {
						id: i.id,
						name: i.nome
					}
				})

				setItems(prepareddata);
				setLoading(false);
			}
		} catch (error) {
			setLoading(false);
			console.log('error', error);
		}
	};

	const onSelectedItemsChange = async selectedItem => {
		setSelectedItems(selectedItem);

		const index = await _.findIndex(items, { id: selectedItem })

		if(index > -1) {
			setSelectedSongs(items[index])
		}

	};

	const onChangeInput = text => {
		getSongs(text);
	};

	const debouncedSearch = React.useCallback(_.debounce(onChangeInput, 2000), []);

	const onChangeDate = () => {};

	const openDatePicker = () => {};

	const onValueChange = itemValue => {
		setselectedValue(itemValue)
	};

	if (!data) return <Text>Nada</Text>;

	return (
		<SafeAreaView style={styles.container}>

				<Block flex style={styles.group}>

					<Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
						<Text>Descrição se houver: </Text>
						<Input right placeholder="Descrição" iconContent={<Block />} />
					</Block>

					<Block style={{ paddingHorizontal: theme.SIZES.BASE, paddingVertical: theme.SIZES.BASE }}>
						<Text>Para: </Text>
						<Picker style={{backgroundColor: '#FFF'}} selectedValue={selectedValue} onValueChange={onValueChange}>
							<Picker.Item label="Culto" value="culto" />
							<Picker.Item label="Ensaio" value="ensaio" />
						</Picker>
					</Block>
					{/* <Block style={{ paddingHorizontal: theme.SIZES.BASE, paddingVertical: theme.SIZES.BASE }}>
						<Text bold size={16}>{moment().format('DD/MM/YYYY')}</Text>
					</Block> */}

					{showDatePicker &&
						<DateTimePicker
							testID="dateTimePicker"
							value={moment().toDate()}
							mode="date"
							is24Hour={true}
							display="calendar"
							onChange={onChangeDate}
					/>}
					
					<Block style={{ paddingHorizontal: theme.SIZES.BASE, paddingVertical: theme.SIZES.BASE }}>
						<Text style={{marginBottom: 5}}>Selecione aqui os louvores: </Text>
						<MultiSelect
							items={items}
							uniqueKey="id"
							ref={multiSelect}
							onSelectedItemsChange={onSelectedItemsChange}
							selectedItems={selectedItems}
							selectText="Selecionar Louvores"
							searchInputPlaceholderText="Pesquisar..."
							onChangeInput={debouncedSearch}
							// altFontFamily="ProximaNova-Light"
							tagRemoveIconColor="#CCC"
							tagBorderColor="#CCC"
							// tagTextColor="#CCC"
							selectedItemTextColor="#CCC"
							selectedItemIconColor="#CCC"
							itemTextColor="#000"
							displayKey="name"
							// searchInputStyle={{ color: '#CCC' }}
							submitButtonColor="#333"
							submitButtonText="Adicionar"
						/>
					</Block>

					<Block style={{ paddingHorizontal: theme.SIZES.BASE, paddingVertical: theme.SIZES.BASE }}>
						{
							selectedSongs.map(item => {
								<ListItem.Content>
									<ListItem.Title>
										{item.nome}
									</ListItem.Title>
								</ListItem.Content>
							})
						}
					</Block>

					<Block style={{ paddingHorizontal: theme.SIZES.BASE, paddingVertical: theme.SIZES.BASE }}>
						<Button title="Salvar"/>
					</Block>
					
				</Block>

		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginHorizontal: 15,
		marginVertical: 10
	},
	home: {
		width: width,
	},
	articles: {
		width: width - theme.SIZES.BASE * 2,
		paddingVertical: theme.SIZES.BASE,
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
	scrollView: {
		flex: 1,
		width: '100%',
	},
	title: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#fff',
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%',
	},
	item: {
		backgroundColor: '#d44b42',
		padding: 10,
		marginVertical: 6,
		marginHorizontal: 10,
		flex: 1,
		alignItems: 'center',
		borderRadius: 7,
	},
});
