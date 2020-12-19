import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator
} from "react-native";
import { ListItem } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Text, View } from "../components/Themed";

import api from "../services/api/axios";

const Item = ({ item }) =>
  <View style={styles.item}>
    <Text style={styles.title}>
    {item.chapter}.{item.verse} {item.text}
    </Text>
  </View>;

export default function TabOneScreen({ navigation, route }) {

  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false)

  navigation.setOptions({
    headerTintColor: "#ffffff",
    headerStyle: {
      backgroundColor: "#d44b42",
      borderBottomColor: "#d44b42",
      borderBottomWidth: 3
    },
    headerTitleStyle: {
      fontSize: 18
    },
  });

  const getCollections = async () => {
    try {
      setLoading(true)
      const response = await api.get(`versao/${route.params.version}/livro/${route.params.id}/capitulo/${route.params.chapter}/versiculos`);
      console.log({response})
      setLoading(false)
      if (response) {
        setData(response.data);
      }
    } catch (error) {
      setLoading(false)
      console.log("error", JSON.stringify(error));
    }
  };

  React.useEffect(() => {
    getCollections();
  }, []);

  const renderItem2 = ({ item }) => {
    return (
      <Item item={item} />
    );
  };

  const keyExtractor = (item, index) => index.toString()

  const renderItem = ({ item }) => (
    <ListItem>
      <ListItem.Content>
        <ListItem.Title>{item.versiculo}. {item.texto}</ListItem.Title>
      </ListItem.Content>
    </ListItem>
  )

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.containerSafe}>
        {
          loading && <ActivityIndicator size="large" color="#d44b42" />
        }
        {/* <TouchableOpacity onPress={() => getCollections()}><Text>Atualizar</Text></TouchableOpacity> */}
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: 16,
    // fontWeight: "bold",
    // color: "#fff"
    // marginTop: 30
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%"
  },

  containerSafe: {
    flex: 1,
    width: "100%",
    // marginTop: StatusBar.currentHeight || 0
  },
  item: {
    backgroundColor: "#f5f5f5",
    padding: 5,
    marginVertical: 6,
    marginHorizontal: 10,
    flex: 1,
    // alignItems: "center",
    borderRadius: 7
  }
  // title: {
  //   fontSize: 32,
  // },
});
