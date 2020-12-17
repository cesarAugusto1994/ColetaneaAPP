import * as React from "react";
import { StyleSheet, SafeAreaView, FlatList, ScrollView, RefreshControl } from "react-native";
import { ListItem } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Text, View } from "../components/Themed";
import api from "../services/api/axios";
import {getToken} from '../services/services/auth';

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

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    getCollections()
  }, [])

  const getCollections = async () => {
    setRefreshing(true);
    try {
      const response = await api.get(`categoria-musicas/${route.params.id}`, {
        headers: {
          Authorization: await getToken()
        }
      });
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
      navigation.navigate("Musica", {
        id: item.id,
        title: item.nome
      });
    }}>
      {/* <Avatar title={item.nome.substring(0,2)} source={{uri: item.avatar_url}} /> */}
      <ListItem.Content>
        <ListItem.Title>{item.nome}</ListItem.Title>
        <ListItem.Subtitle>Tonalidade: {item.tom}</ListItem.Subtitle>
        {item.numero && <ListItem.Subtitle>Número: {item.numero}</ListItem.Subtitle>}
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
          scrollEnabled
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
        </ScrollView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5"
  },
  scrollView: {
    flex: 1,
    width: '100%'
  },
  title: {
    fontSize: 14,
    fontWeight: "bold"
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%"
  },

  containerSafe: {
    flex: 1,
    width: "100%",
  },
  item: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 16
  }
});
