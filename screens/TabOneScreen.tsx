import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  StatusBar,
  Button
} from "react-native";
import { Avatar, Card, Image, ListItem } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";

import EditScreenInfo from "../components/EditScreenInfo";
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

  navigation.setOptions({
    title: "Home",
    headerTintColor: "#ffffff",
    headerStyle: {
      backgroundColor: "#d44b42",
      borderBottomColor: "#d44b42",
      borderBottomWidth: 3
    },
    headerTitleStyle: {
      fontSize: 18
    },
    headerRight: () =>
      <TouchableOpacity
        style={{ marginRight: 15 }}
        onPress={() => {
          navigation.navigate("Pesquisar");
        }}
      >
        <Ionicons name="ios-search" size={25} color="#fff" />
      </TouchableOpacity>
  });

  const getCollections = async () => {
    try {
      const response = await api.get("collections");
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
      <View style={{ width: "50%", flexDirection: "column" }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Categorias", {
              id: item.id,
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
      navigation.navigate("Categorias", {
        id: item.id,
        title: item.nome
      });
    }}>
      <Avatar size="medium" title={item.nome.substring(0,2)} source={{uri: item.avatar_url}} />
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
          data.length ?
            <FlatList
              data={data}
              scrollEnabled
              renderItem={renderItem}
              keyExtractor={keyExtractor}
            />
            : 
            <>
            <Card.Title>NADA ENCONTRADO.</Card.Title>
              <Card.Divider/>
              <View style={{position:"relative",alignItems:"center"}}>
                <Avatar
                  rounded
                  size="large"
                  icon={{name: 'home', type: 'font-awesome'}}
                  onPress={() => console.log("Works!")}
                  activeOpacity={0.7}
                  // containerStyle={{flex: 5, marginRight: 60}}
                />
              </View>
            </>
        }

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
