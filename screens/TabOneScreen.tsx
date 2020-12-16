import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  StatusBar,
  Button,
  RefreshControl,
  ScrollView
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

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    getCollections()
  }, [])

  const getCollections = async () => {
    setRefreshing(true);
    try {
      const response = await api.get("collections");
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

  const keyExtractor = (item, index) => index.toString()

  const renderItem = ({ item }) => (
    <ListItem bottomDivider onPress={() => {
      navigation.navigate("Categorias", {
        id: item.id,
        title: item.nome
      });
    }}>
      <Avatar size="medium" title={item.nome.substring(0, 2)} source={{ uri: item.avatar_url }} />
      <ListItem.Content>
        <ListItem.Title>{item.nome}</ListItem.Title>
        {/* <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle> */}
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  )

  return (

    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {
          data.length ?
            <FlatList
              data={data}
              scrollEnabled
              renderItem={renderItem}
              keyExtractor={keyExtractor}
            />
            :
            <View style={styles.notfound}>
              <Card.Title style={styles.notfoundTitle}>NADA ENCONTRADO.</Card.Title>
              <Card.Divider />
            </View>
        }
      </ScrollView>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notfound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#f5f5f5"
  },
  notfoundTitle: {
    fontSize: 18,
  },
  scrollView: {
    flex: 1,
    width: '100%'
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff"
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%"
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
});
