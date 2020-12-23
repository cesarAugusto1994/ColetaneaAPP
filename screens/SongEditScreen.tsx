import * as React from "react";
import { StyleSheet, SafeAreaView, TouchableHighlight } from "react-native";
import { Text, View } from "../components/Themed";
import api from "../services/api/axios";
import {getToken} from '../services/services/auth';
import TextEditor from '../components/SongEditor'
import { Ionicons } from '@expo/vector-icons';

let textString: String = ''

export default function MainScreen({ navigation, route }) {

  const [data, setData] = React.useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const updateSongText = text => {
    textString = text
  }

  const updateSong = async () => {
		try {
      setSaving(true)
      console.log(textString)
			const response = await api.put(
				`musicas/${route.params.id}`,
				{
					letra: textString,
				},
				{
					headers: {
						Authorization: await getToken(),
					},
				}
      );
      console.log(response.data)
			if (response && response.data) {
				setSaving(false)
			}
		} catch (error) {
			setSaving(false)
			console.log('error', error);
		}
	};

  React.useEffect(() => {

    navigation.setOptions({
      headerTintColor: "#d44b42",
      headerStyle: {
        borderBottomWidth: 0,
      },
      headerTitleStyle: {
        fontSize: 18
      },
      headerRight: () =>
				<TouchableHighlight
					style={{ marginRight: 15 }}
					onPress={() => {
						updateSong();
					}}
				>
					<Ionicons name="ios-save-outline" size={25} color="#d44b42" />
				</TouchableHighlight>,
    });

  }, [])
  


  // const onRefresh = React.useCallback(() => {
  //   getSong()
  // }, [])

  const getSong = async () => {
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
    getSong();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {
        data && <TextEditor song={data} updateSongText={updateSongText} />
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
