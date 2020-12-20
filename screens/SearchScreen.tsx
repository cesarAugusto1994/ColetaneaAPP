import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator
} from "react-native";

import * as _ from "lodash";
import api from "../services/api/axios";
import { RootStackParamList } from "../types";
import { DrawerActions } from "@react-navigation/native";
import { SearchBar, Card, ListItem } from 'react-native-elements';

const Item = ({item}) =>
  <View style={styles.item}>
    <Text style={styles.title}>
      {item.nome}
    </Text>
    {item.numero &&
        <Text style={styles.descriptionsSong}>
          Numero: {item.numero}
        </Text>}
    {item.categoria &&
        <Text style={styles.descriptionsSong}>
          Categoria: {item.categoria.nome}
        </Text>}
      {item.categoria &&
        <Text style={styles.descriptionsSong}>
          Coleção: {item.categoria.colecao.nome}
        </Text>}
  </View>;

export default function NotFoundScreen({
  navigation
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const [search, setsearch] = React.useState('');

  React.useEffect(() => {
		navigation.setOptions({
			title: 'Pesquisar',
			headerTintColor: '#d44b42',
			headerStyle: {
				borderBottomWidth: 0,
			},
			headerTitleStyle: {
				fontSize: 18,
			},
		});
	}, []);

  const getSongs = async text => {
    try {
      const response = await api.get(`musicas/search/${text}`);
      if (response) {
        console.log(response.data);
        setData(response.data);
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.log("error", JSON.stringify(error));
    }

    
  };

  const keyExtractor = (item, index) => index.toString()

  const renderItem = ({ item }) => (
    <ListItem bottomDivider onPress={() => {
      navigation.navigate("Musica", {
        id: item.id,
        title: item.nome
      });
    }}>
      <ListItem.Content>
        <ListItem.Title>{item.nome}</ListItem.Title>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  )

  const onChangeText = async text => {
    setLoading(true)
    await getSongs(text);
  };

  const handleSearch = text => {
    setsearch(text)
  }

  const debouncedSearch = _.debounce(onChangeText, 2000);

  return (
    <View style={styles.container}>
      <SearchBar
        lightTheme 
        containerStyle={{width: '100%'}}
        style={{width: '100%'}}
        placeholder="Pesquisar..."
        onChangeText={text => {
          debouncedSearch(text)
          handleSearch(text)  
        }}
        value={search}
      />

      <SafeAreaView style={styles.containerSafe}>
        {loading
          ? <ActivityIndicator size="large" color="#00ff00" />
          : <>
            {
              data.length > 0 ? 
              <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
            /> :
              <View style={styles.notfound}>
                <Card.Title style={styles.notfoundTitle}>NADA ENCONTRADO.</Card.Title>
                <Card.Divider />
              </View>
            }
          </>}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  notfound: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	notfoundTitle: {
		fontSize: 18,
	},
  containerSafe: {
    flex: 1,
    width: "100%"
  },
  title: {
    fontSize: 14,
    fontWeight: "bold"
  },
  link: {
    marginTop: 15,
    paddingVertical: 15
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7"
  },
  item: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 16
  }
});
