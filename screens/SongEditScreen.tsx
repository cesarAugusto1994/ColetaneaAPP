import * as React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import { Text, View } from "../components/Themed";
import api from "../services/api/axios";
import {getToken} from '../services/services/auth';
import TextEditor from '../components/SongEditor'

const Item = ({ title, description }) =>
  <View style={styles.item}>
    <Text style={styles.title}>
      {description && `${description} - `} {title}
    </Text>
  </View>;

export default function MainScreen({ navigation, route }) {

  const [data, setData] = React.useState(null);
  const [refreshing, setRefreshing] = React.useState(false);

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
    getCollections()
  }, [])

  const getCollections = async () => {
    setRefreshing(true);
    try {
      const response = await api.get(`musicas/${route.params.id}`, {
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


  return (
    <SafeAreaView style={styles.container}>

      {
        data && <TextEditor song={data} />
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
