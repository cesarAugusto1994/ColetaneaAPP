import * as React from "react";
import { StyleSheet, SafeAreaView, FlatList, Text, View } from "react-native";
import { Card, ListItem } from "react-native-elements";
import api from "../services/api/axios";
import {getToken, getUser} from '../services/services/auth';

export default function FavoritesScreen({ navigation, route }) {

  const [data, setData] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState(null)

  const getCurrentUser = async () => {
		const parseUser = await getUser()
		setCurrentUser(JSON.parse(parseUser))
	}

	React.useEffect(() => {

		getCurrentUser()

	}, [])

  React.useEffect(() => {

    navigation.setOptions({
      headerTintColor: "#d44b42",
      headerStyle: {
        borderBottomWidth: 0,
      },
      headerTitleStyle: {
        fontSize: 18
      }
    });

  }, [])

  const onRefresh = React.useCallback(() => {
    getCurrentUser()
  }, [])

  const keyExtractor = (item, index) => index.toString()

  const renderItem = ({ item }) => (
    <ListItem bottomDivider onPress={() => {
      navigation.navigate("FavoritasMusicas", {
        id: item.id,
        title: item.nome
      });
    }}>
      <ListItem.Content>
        <ListItem.Title><Text>{item.nome}</Text></ListItem.Title>
        <ListItem.Subtitle><Text>Tonalidade: {item.tom}</Text></ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  )

  if (!currentUser) return <Text>Carregando...</Text>

  return (
    <SafeAreaView style={styles.container}>
      {
        currentUser && currentUser.musicas.length ? (
          <FlatList
            onTouchStart={onRefresh}
            data={currentUser.musicas}
            scrollEnabled
            renderItem={renderItem}
            keyExtractor={keyExtractor}
          />)
          :
          <View style={styles.notfound}>
            <Card.Title style={styles.notfoundTitle}>NADA ENCONTRADO.</Card.Title>
            <Card.Divider />
          </View>
        
      }
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
  notfound: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#f5f5f5',
	},
	notfoundTitle: {
		fontSize: 18,
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
