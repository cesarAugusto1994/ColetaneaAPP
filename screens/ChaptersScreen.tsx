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
const _ = require('lodash')

export default function TabOneScreen({ navigation, route }) {

  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
		navigation.setOptions({
			headerTintColor: '#d44b42',
			headerStyle: {
				borderBottomWidth: 0,
			},
			headerTitleStyle: {
				fontSize: 18,
			},
		});
	}, []);

  const getCollections = async () => {

    const qtde = route.params.qtde_chapters

    const range = _.range(1, qtde+1)

    setData(range)

  };

  React.useEffect(() => {
    getCollections();
  }, []);

  const keyExtractor = (item, index) => index.toString()

  const renderItem = ({ item }) => (
    <ListItem bottomDivider onPress={() => {
      navigation.navigate("Verse", {
        id: route.params.id,
        version: route.params.version,
        title: `${route.params.title} ${item}`,
        chapter: item
      });
    }}>
      {/* <Avatar size="medium" title={item.liv_nome.substring(0,2)} source={{uri: item.avatar_url}} /> */}
      <ListItem.Content>
        <ListItem.Title>Capítulo {item}</ListItem.Title>
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
