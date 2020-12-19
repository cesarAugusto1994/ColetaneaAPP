import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import {
	StyleSheet,
	SafeAreaView,
	FlatList,
	StatusBar,
	Dimensions,
	RefreshControl,
	ScrollView,
	TouchableOpacity,
} from 'react-native';
import { Avatar, Image, ListItem, Card } from 'react-native-elements';
import { View } from '../components/Themed';
import { getToken } from '../services/services/auth';
import api from '../services/api/axios';
import MultiSelect from 'react-native-multiple-select';
import moment from 'moment';
// Galio components
import { Block, Text, Button as GaButton, theme } from 'galio-framework';
// Argon themed components
import { argonTheme, tabs } from '../components/constants/';
import { Select, Icon, Input, Header, Switch } from '../components/galio/';
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

	const multiSelect = React.useRef(null);

	navigation.setOptions({
		title: 'Nova Lista',
		headerTintColor: '#ffffff',
		headerStyle: {
			backgroundColor: '#d44b42',
			borderBottomColor: '#d44b42',
			borderBottomWidth: 3,
		},
		headerTitleStyle: {
			fontSize: 18,
		},
	});

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
			console.log(response.data);
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
			const response = await api.get(`musica/${text}`);
			if (response) {
				console.log(response.data);
				setData(response.data);
				setLoading(false);
			}
		} catch (error) {
			setLoading(false);
			console.log('error', JSON.stringify(error));
		}
	};

	const items = [
		{
			id: '92iijs7yta',
			name: 'Ondo',
		},
		{
			id: 'a0s0a8ssbsd',
			name: 'Ogun',
		},
		{
			id: '16hbajsabsd',
			name: 'Calabar',
		},
		{
			id: 'nahs75a5sg',
			name: 'Lagos',
		},
		{
			id: '667atsas',
			name: 'Maiduguri',
		},
		{
			id: 'hsyasajs',
			name: 'Anambra',
		},
		{
			id: 'djsjudksjd',
			name: 'Benue',
		},
		{
			id: 'sdhyaysdj',
			name: 'Kaduna',
		},
		{
			id: 'suudydjsjd',
			name: 'Abuja',
		},
	];

	const onSelectedItemsChange = selectedItem => {
		setSelectedItems(selectedItem);
	};

	const onChangeInput = text => {
		getSongs(text);
	};

	const debouncedSearch = _.debounce(onChangeInput, 2000);

	const onChangeDate = () => {};

	const openDatePicker = () => {};

	if (!data) return <Text>Nada</Text>;

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView
				contentContainerStyle={styles.scrollView}
				// refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
			>
				<Block flex style={styles.group}>
					<Block style={{ paddingHorizontal: theme.SIZES.BASE, paddingVertical: theme.SIZES.BASE }}>
						<Picker selectedValue="culto" onValueChange={(itemValue, itemIndex) => {}}>
							<Picker.Item label="Culto" value="culto" />
							<Picker.Item label="Ensaio" value="ensaio" />
						</Picker>
					</Block>
					<Block style={{ paddingHorizontal: theme.SIZES.BASE, paddingVertical: theme.SIZES.BASE }}>
						<Text bold size={16}>{moment().format('DD/MM/YYYY')}</Text>
					</Block>

					{showDatePicker &&
						<DateTimePicker
							testID="dateTimePicker"
							value={moment().toDate()}
							mode="date"
							is24Hour={true}
							display="calendar"
							onChange={onChangeDate}
						/>}
					x
					<Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
						<Input right placeholder="Descrição" iconContent={<Block />} />
					</Block>
					
					<Block style={{ paddingHorizontal: theme.SIZES.BASE, paddingVertical: theme.SIZES.BASE }}>
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
							tagTextColor="#CCC"
							selectedItemTextColor="#CCC"
							selectedItemIconColor="#CCC"
							itemTextColor="#000"
							displayKey="name"
							searchInputStyle={{ color: '#CCC' }}
							submitButtonColor="#CCC"
							submitButtonText="Submit"
						/>
					</Block>
				</Block>

			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
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
