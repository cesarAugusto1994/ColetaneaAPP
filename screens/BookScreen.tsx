import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  StatusBar,
  Button,
  ActivityIndicator
} from "react-native";
import { Avatar, ListItem } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";

import { Text, View } from "../components/Themed";

import api from "../services/api/axios";

const Item = ({ title }) =>
  <View style={styles.item}>
    <Text style={styles.title}>
      {title}
    </Text>
  </View>;

export default function TabOneScreen({ navigation }) {

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
      const response = await api.get("versoes");
      console.log("response", JSON.stringify(response.data));
      setLoading(false)
      if (response) {
        setData(response.data);
      }
    } catch (error) {
      setLoading(false)
      console.log("error", JSON.stringify(error.message));
    }
  };

  React.useEffect(() => {
    getCollections();
  }, []);

  const renderItem2 = ({ item }) => {
    return (
      <View style={{ width: "50%", flexDirection: "column" }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Books", {
              id: item.vrs_id,
              title: item.nome
            });
          }}
        >
          <Item title={item.nome} />
        </TouchableOpacity>
      </View>
    );
  };

  const keyExtractor = (item, index) => index.toString()

  const renderItem = ({ item }) => (
    <ListItem bottomDivider onPress={() => {
      navigation.navigate("Books", {
        id: item.id,
        title: item.nome
      });
    }}>
      {/* <Avatar size="medium" title={item.liv_nome.substring(0,2)} source={{uri: item.avatar_url}} /> */}
      <ListItem.Content>
        <ListItem.Title>{item.nome}</ListItem.Title>
        {/* <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle> */}
      </ListItem.Content>
      <ListItem.Chevron />
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
    fontWeight: "bold",
    color: "#fff"
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
    backgroundColor: "#d44b42",
    padding: 10,
    marginVertical: 6,
    marginHorizontal: 10,
    flex: 1,
    alignItems: "center",
    borderRadius: 7
  }
  // title: {
  //   fontSize: 32,
  // },
});
