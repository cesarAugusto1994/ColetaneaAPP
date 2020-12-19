import * as React from "react";
import { StyleSheet, SafeAreaView, FlatList, ScrollView, RefreshControl } from "react-native";
import { ListItem } from "react-native-elements";
import {getToken} from '../services/services/auth';
import api from "../services/api/axios";

export default function CategoriesScreen({ navigation, route }) {
  const [data, setData] = React.useState([]);

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

  const getCollections = async () => {
    setRefreshing(true);
    try {
      const response = await api.get(
        `colecao-categorias/${route.params.id}`,
        {
          headers: {
            Authorization: await getToken()
          }
        }
      );
      if (response) {
        setData(response.data);
        setRefreshing(false);
      }
    } catch (error) {
      setRefreshing(false);
      console.log("error", JSON.stringify(error));
    }
  };

  React.useEffect(() => {
    getCollections();
  }, []);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    getCollections()
  }, [])

  const keyExtractor = (item, index) => index.toString()

  const renderItem = ({ item }) => (
    <ListItem bottomDivider onPress={() => {
      navigation.navigate("Musicas", {
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
      >
        <FlatList
          data={data}
          renderItem={renderItem}
          scrollEnabled
          keyExtractor={keyExtractor}
        />
        </ScrollView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
    width: '100%'
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    alignSelf: 'center'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%"
  },
  item: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    alignItems: "center",
    textAlign: 'center',
    borderRadius: 7,
    flex: 1
  }
});
