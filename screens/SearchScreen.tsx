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

  navigation.setOptions({
    headerTintColor: "#ffffff",
    headerStyle: {
      backgroundColor: "#d44b42",
      borderBottomColor: "#d44b42",
      borderBottomWidth: 3
    },
    headerTitleStyle: {
      fontSize: 18
    }
  });

  const getSongs = async text => {
    try {
      const response = await api.get(`songs/search/${text}`);
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

  const renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Musica", {
              id: item.id,
              title: item.nome
            });
          }}
        >
          <Item item={item} />
        </TouchableOpacity>
      </View>
    );
  };

  const onChangeText = async text => {
    setLoading(true)
    await getSongs(text);
  };

  const debouncedSearch = _.debounce(onChangeText, 2000);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Digite a pesquisa"
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          width: "100%"
        }}
        onChangeText={debouncedSearch}
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
              keyExtractor={item => item.id}
            /> :
              <Text>Nenhum registro encontrado.</Text>
            }
          </>}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  containerSafe: {
    flex: 1,
    width: "100%"
    // marginTop: StatusBar.currentHeight || 0
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
