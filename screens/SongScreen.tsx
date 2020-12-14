import * as React from "react";
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  StatusBar,
  Dimensions
} from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { transpose } from "chord-transposer";
import WebView from "react-native-webview";
import HTMLView from "react-native-htmlview";
import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import api from "../services/api/axios";
import { Ionicons } from "@expo/vector-icons";

const Item = ({ title }) =>
  <View style={styles.item}>
    <Text style={styles.title}>
      {title}
    </Text>
  </View>;

const FirstRoute = ({ data }) => {
  const [spanFontSize, setspanFontSize] = React.useState(15);
  const [favorite, setFavorite] = React.useState(false);

  const getWords = () => {
    // if(!data.letra) {
    //   return '<p>Letra não encontrada.</p>'
    // }

    // const w = transpose(data.letra).fromKey('D').toKey('F').toString()

    const text = data.letra;

    const output = text.replace(
      "(?m)(^| )([A-G](##?|bb?)?((sus|maj|min|aug|dim)\\d?)?(/[A-G](##?|bb?)?)?)( (?!\\w)|$)",
      "[$2]"
    );

    // console.log(output);

    return `<span>${output}</span>`;
  };

  const changeTextSizeDown = () => {
    if (spanFontSize <= 10) return;
    setspanFontSize(spanFontSize - 1);
  };

  const changeTextSizeUp = () => {
    if (spanFontSize >= 36) return;
    setspanFontSize(spanFontSize + 1);
  };

  const handleFavorite = () => {
    setFavorite(!favorite);
  };

  return (
    <View
      style={[
        styles.scene,
        { backgroundColor: "#fff", height: Dimensions.get("screen").height }
      ]}
    >
      <SafeAreaView style={styles.containerSafe}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 0.7 }}>
            <Text style={styles.descriptionsSong}>
              Número: {data.numero}
            </Text>
            <Text style={styles.descriptionsSong}>
              Tom: {data.tom}
            </Text>
          </View>

          <View
            style={{
              flex: 0.2,
              flexDirection: "row",
              alignSelf: "flex-end",
              right: 0,
              alignContent: "space-between"
            }}
          >
            <TouchableOpacity
              style={styles.btnDown}
              onPress={changeTextSizeDown}
            >
              <Text style={{ fontSize: 18 }}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnUp} onPress={changeTextSizeUp}>
              <Text style={{ fontSize: 18 }}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnUp} onPress={handleFavorite}>
              {favorite
                ? <Ionicons name="ios-star" color="#ffd000" size={20} />
                : <Ionicons name="ios-star-outline" size={20} />}
            </TouchableOpacity>
          </View>
        </View>

        {/* <Text>{Transposer.transpose(data.letra).toString()}</Text> */}
        {/* <WebView source={{html: Transposer.transpose(data.letra).toString()}} /> */}
        {/* <WebView automaticallyAdjustContentInsets={false} style={{backgroundColor: '#cfc'}} html={Transposer.transpose(data.letra).toString()} /> */}
        <ScrollView
          contentContainerStyle={{ paddingVertical: 20 }}
          // showsVerticalScrollIndicator={false}
          // pinchGestureEnabled
          // maximumZoomScale={10}
          // minimumZoomScale={3}
          // onGestureEvent={handleOnGestureEvent}
        >
          {data.letra
            ? <HTMLView
                value={getWords()}
                stylesheet={{ span: { fontSize: spanFontSize } }}
              />
            : <Text>Letra não encontrada.</Text>}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const SecondRoute = ({ data }) => {
  return (
    <View style={[styles.scene, { backgroundColor: "#f5f5f5", padding: 20 }]}>
      <Text style={styles.descriptionsSong}>Autor: Não Informado</Text>
      {data.categoria &&
        <Text style={styles.descriptionsSong}>
          Categoria: {data.categoria.nome}
        </Text>}
      {data.categoria &&
        <Text style={styles.descriptionsSong}>
          Coleção: {data.categoria.colecao.nome}
        </Text>}
      <Text style={styles.descriptionsSong}>
        Atualizado Em: {data.cadastro}
      </Text>
    </View>
  );
};

const ThirdRoute = ({ data }) => {
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => {}}>
        <Item title={item.nome} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.scene, { backgroundColor: "#f5f5f5" }]}>
      <SafeAreaView style={styles.containerSafe}>
        {data.musica_anexos && data.musica_anexos.length > 0
          ? <FlatList
              data={data.musica_anexos}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
          : <Text>Nenhum anexo encontrado.</Text>}

        <Text style={styles.comments}>Comentários</Text>

        {data.comentarios && data.comentarios.length > 0
          ? <FlatList
              data={data.comentarios}
              renderItem={({ item }) =>
                <View style={styles.item}>
                  <Text style={styles.title}>
                    {item.usuarios.nome}
                  </Text>
                  <Text style={styles.title}>
                    {item.comentario}
                  </Text>
                </View>}
              keyExtractor={item => item.id}
            />
          : <Text>Nenhum comentário encontrado.</Text>}
      </SafeAreaView>
    </View>
  );
};
const initialLayout = { width: Dimensions.get("window").width };

export default function CategoriesScreen({ route, navigation }) {
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
      const response = await api.get(`song/${route.params.id}`);
      if (response) {
        console.log(response.data);
        setData(response.data);
      }
    } catch (error) {
      console.log("error", JSON.stringify(error));
    }
  };

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Letra" },
    { key: "second", title: "Info." },
    { key: "third", title: "Mídias" }
  ]);

  const renderScene = SceneMap({
    first: () => <FirstRoute data={data} />,
    second: () => <SecondRoute data={data} />,
    third: () => <ThirdRoute data={data} />
  });

  React.useEffect(() => {
    getCollections();
  }, []);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      tabBarPosition="top"
      style={{ backgroundColor: "#333" }}
      renderTabBar={props =>
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: "white" }}
          style={{ backgroundColor: "#d44b42", height: 40 }}
          // indicatorStyle={{backgroundColor: "#555555"}}
        />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: 14
    // fontWeight: "bold"
    // marginTop: 30
  },
  scene: {
    flex: 1
  },
  descriptionsSong: {
    fontSize: 14
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%"
  },

  containerSafe: {
    padding: 15,
    flex: 1,
    width: "100%"
  },
  item: {
    backgroundColor: "#f5f5f5",
    padding: 5,
    marginVertical: 8,
    marginHorizontal: 16
  },
  btnDown: {
    padding: 10,
    paddingHorizontal: 10,
    margin: 3,
    backgroundColor: "#f5f5f5",
    borderRadius: 5
  },
  btnUp: {
    padding: 10,
    paddingHorizontal: 10,
    margin: 3,
    backgroundColor: "#f5f5f5",
    borderRadius: 5
  },
  comments: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: "bold"
  }
  // title: {
  //   fontSize: 32,
  // },
});
