import * as React from "react";
import { StyleSheet, SafeAreaView, FlatList, StatusBar } from "react-native";
import { ListItem } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";

import api from "../services/api/axios";

const Item = ({ title, description }) =>
  <View style={styles.item}>
    <Text style={styles.title}>
      {description && `${description} - `} {title}
    </Text>
  </View>;

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
    try {
      const response = await api.get(`category/${route.params.id}/songs`);
      if (response) {
        setData(response.data);
      }
    } catch (error) {
      console.log("error", JSON.stringify(error));
    }
  };

  React.useEffect(() => {
    getCollections();
  }, []);

  const renderItem2 = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Musica", {
            id: item.id,
            title: item.nome,
          });
        }}
      >
        <Item title={item.nome} description={item.numero} />
      </TouchableOpacity>
    );
  };

  const keyExtractor = (item, index) => index.toString()

  const renderItem = ({ item }) => (
    <ListItem bottomDivider onPress={() => {
      navigation.navigate("Musica", {
        id: item.id,
        title: item.nome
      });
    }}>
      {/* <Avatar title={item.nome.substring(0,2)} source={{uri: item.avatar_url}} /> */}
      <ListItem.Content>
        <ListItem.Title>{item.nome}</ListItem.Title>
        <ListItem.Subtitle>Tonalidade: {item.tom}</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  )


  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.containerSafe}>
        <FlatList
          data={data}
          scrollEnabled
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
    justifyContent: "center",
    backgroundColor: "#f5f5f5"
  },
  title: {
    fontSize: 14,
    fontWeight: "bold"
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
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 16
  }
  // title: {
  //   fontSize: 32,
  // },
});
