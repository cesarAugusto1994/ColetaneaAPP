import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import TabOneScreen from "../screens/TabOneScreen";
import RithymsScreen from "../screens/RithymsScreen";
import RithymSongsScreen from "../screens/RithymSongsScreen";
import AuthorsScreen from "../screens/AuthorsScreen";
import AuthorSongsScreen from "../screens/AuthorSongsScreen";
import ArtistsScreen from "../screens/ArtistsScreen";
import ArtistSongsScreen from "../screens/ArtistSongsScreen";
import TagsScreen from "../screens/TagsScreen";
import TagSongsScreen from "../screens/TagSongsScreen";
import CategoriesScreen from "../screens/CategoriesScreen";
import CategoryAddScreen from "../screens/CategoryAddScreen";
import SongsScreen from "../screens/SongsScreen";
import Songscreen from "../screens/SongScreen";
import FavoriteSongsScreen from "../screens/FavoriteSongsScreen";
import SongEditScreen from "../screens/SongEditScreen";
import SongEditInfoScreen from "../screens/SongEditInfoScreen";
import SongAddScreen from "../screens/SongAddScreen";
import SearchScreen from "../screens/SearchScreen";
import TabTwoScreen from "../screens/TabTwoScreen";
import TabConfigsScreen from "../screens/TabConfigsScreen";
import BookScreen from "../screens/BookScreen";
import BooksScreen from "../screens/BooksScreen";
import ChaptersScreen from "../screens/ChaptersScreen";
import VerseScreen from "../screens/VerseScreen";

import UsersScreen from "../screens/UsersScreen";
import LoginsScreen from "../screens/LoginsScreen";

import TabDiscoverScreen from "../screens/TabDiscoverScreen";
import DiscoverDetailsScreen from "../screens/DiscoverDetailsScreen";

import GroupScreen from "../screens/GroupScreen";
import GroupUsersScreen from "../screens/GroupUsersScreen";
import GroupListsScreen from "../screens/GroupListsScreen";
import GroupListDetailsScreen from "../screens/GroupListDetailsScreen";
import GroupListAddScreen from "../screens/GroupListAddScreen";

import AboutScreen from "../screens/AboutScreen";
import UserEditScreen from "../screens/UserEditScreen";

import ErrorScreen from '../screens/ErrorScreen'
import ErrorsListScreen from '../screens/ErrorsListScreen'

import {
  BottomTabParamList,
  TabOneParamList,
  TabTwoParamList,
  TabConfigsParamList,
  TabBookParamList
} from "../types";

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      tabBarOptions={{
        activeTintColor: Colors[colorScheme].tint,
        inactiveTintColor: "#d44b42"
      }}
    >
      <BottomTab.Screen
        name="Início"
        component={TabOneNavigator}
        options={{
          tabBarIcon: ({ color }) =>
            <TabBarIcon name="ios-apps" color={color} />
        }}
      />
      {/* <BottomTab.Screen
        name="Bíblias"
        component={TabBookNavigator}
        options={{
          tabBarIcon: ({ color }) =>
            <TabBarIcon name="ios-book-outline" color={color} />
        }}
      /> */}
      <BottomTab.Screen
        name="Descobrir"
        component={TabDiscoverNavigator}
        options={{
          tabBarIcon: ({ color }) =>
            <TabBarIcon name="ios-globe-outline" color={color} />
        }}
      />
      <BottomTab.Screen
        name="Grupos"
        component={TabTwoNavigator}
        options={{
          tabBarIcon: ({ color }) =>
            <TabBarIcon name="ios-people-outline" color={color} />
        }}
      />
      <BottomTab.Screen
        name="Configurações"
        component={TabConfigsNavigator}
        options={{
          tabBarIcon: ({ color }) =>
            <TabBarIcon name="ios-settings-outline" color={color} />
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: string; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<TabOneParamList>();

function TabOneNavigator() {
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name="TabOneScreen"
        component={TabOneScreen}
        options={{ headerTitle: "Minha Coletânea" }}
      />
      <TabOneStack.Screen
        name="Ritmos"
        component={RithymsScreen}
        options={({ route }) => ({ 
          title: route.params.title
         })}
      />
      <TabOneStack.Screen
        name="RithymSongs"
        component={RithymSongsScreen}
        options={({ route }) => ({ 
          title: route.params.title
         })}
      />
      <TabOneStack.Screen
        name="Autores"
        component={AuthorsScreen}
        options={({ route }) => ({ 
          title: route.params.title
         })}
      />
      <TabOneStack.Screen
        name="AuthorSongs"
        component={AuthorSongsScreen}
        options={({ route }) => ({ 
          title: route.params.title
         })}
      />
      <TabOneStack.Screen
        name="Tags"
        component={TagsScreen}
        options={({ route }) => ({ 
          title: 'Seleção Especial'
         })}
      />
      <TabOneStack.Screen
        name="TagSongs"
        component={TagSongsScreen}
        options={({ route }) => ({ 
          title: route.params.title
         })}
      />
      <TabOneStack.Screen
        name="Artistas"
        component={ArtistsScreen}
        options={({ route }) => ({ 
          title: route.params.title
         })}
      />
      <TabOneStack.Screen
        name="ArtistSongs"
        component={ArtistSongsScreen}
        options={({ route }) => ({ 
          title: route.params.title
         })}
      />
      <TabOneStack.Screen
        name="Categorias"
        component={CategoriesScreen}
        options={({ route }) => ({ 
          title: route.params.title
         })}
      />
      <TabOneStack.Screen
        name="Nova Categoria"
        component={CategoryAddScreen}
        options={({ route }) => ({ 
          title: route.params.title
         })}
      />
      <TabOneStack.Screen
        name="Musicas"
        component={SongsScreen}
        options={({ route }) => ({ 
          title: route.params.title
         })}
      />
      <TabOneStack.Screen
        name="Musica"
        component={Songscreen}
        options={({ route }) => ({ 
          title: route.params.title,
        })}
      />
      <TabOneStack.Screen
        name="LetraEditor"
        component={SongEditScreen}
        options={({ route }) => ({ 
          title: "Editor",
        })}
      />
      <TabOneStack.Screen
        name="SongEditor"
        component={SongEditInfoScreen}
        options={({ route }) => ({ 
          title: "Editar Informações",
        })}
      />
      <TabOneStack.Screen
        name="SongAdd"
        component={SongAddScreen}
        options={({ route }) => ({ 
          title: "Adicionar",
        })}
      />
      <TabOneStack.Screen
        name="Pesquisar"
        component={SearchScreen}
      />
    </TabOneStack.Navigator>
  );
}

const TabBookStack = createStackNavigator<TabBookParamList>();

function TabBookNavigator() {
  return (
    <TabBookStack.Navigator>
      <TabBookStack.Screen
        name="BookScreen"
        component={BookScreen}
        options={{ headerTitle: "Bíblias" }}
      />
      <TabBookStack.Screen
        name="Books"
        component={BooksScreen}
        options={({ route }) => ({ 
          title: route.params.title
        })}
      />
      <TabBookStack.Screen
        name="Chapters"
        component={ChaptersScreen}
        options={({ route }) => ({ 
          title: route.params.title
        })}
      />
      <TabBookStack.Screen
        name="Verse"
        component={VerseScreen}
        options={({ route }) => ({ 
          title: route.params.title
        })}
      />
    </TabBookStack.Navigator>
  );
}

const TaDiscoverBookStack = createStackNavigator<TabBookParamList>();

function TabDiscoverNavigator() {
  return (
    <TaDiscoverBookStack.Navigator>
      <TaDiscoverBookStack.Screen
        name="DiscoverScreen"
        component={TabDiscoverScreen}
        options={{ headerTitle: "Postagens" }}
      />
      <TaDiscoverBookStack.Screen
        name="DiscoverDetailsScreen"
        component={DiscoverDetailsScreen}
        options={{ headerTitle: "Postagem" }}
      />
    </TaDiscoverBookStack.Navigator>
  );
}

const TabTwoStack = createStackNavigator<TabTwoParamList>();

function TabTwoNavigator() {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="TabTwoScreen"
        component={TabTwoScreen}
        options={{ headerTitle: "Grupos" }}
      />
      <TabBookStack.Screen
        name="Group"
        component={GroupScreen}
        options={({ route }) => ({ 
          title: route.params.title
        })}
      />
      <TabBookStack.Screen
        name="GroupUsers"
        component={GroupUsersScreen}
        options={({ route }) => ({ 
          title: route.params.title
        })}
      />
      <TabBookStack.Screen
        name="GroupLists"
        component={GroupListsScreen}
        options={({ route }) => ({ 
          title: route.params.title
        })}
      />
      <TabBookStack.Screen
        name="GroupListAdd"
        component={GroupListAddScreen}
        options={({ route }) => ({ 
          title: "Nova Lista"
        })}
      />
      <TabBookStack.Screen
        name="GroupListsDetails"
        component={GroupListDetailsScreen}
        options={({ route }) => ({ 
          title: route.params.title
        })}
      />
      <TabOneStack.Screen
        name="Musica"
        component={Songscreen}
        options={({ route }) => ({ 
          title: route.params.title,
        })}
      />
    </TabTwoStack.Navigator>
  );
}

const TabConfigsStack = createStackNavigator<TabConfigsParamList>();

function TabConfigsNavigator() {
  return (
    <TabConfigsStack.Navigator>
      <TabConfigsStack.Screen
        name="TabConfigsScreen"
        component={TabConfigsScreen}
        options={{ headerTitle: "Configurações" }}
      />
      <TabConfigsStack.Screen
        name="Favoritos"
        component={FavoriteSongsScreen}
        options={{ headerTitle: "Favoritos" }}
      />
      <TabOneStack.Screen
        name="FavoritasMusicas"
        component={Songscreen}
        options={({ route }) => ({ 
          title: route.params.title,
        })}
      />
      <TabOneStack.Screen
        name="Sobre"
        component={AboutScreen}
        options={({ route }) => ({ 
          title: "Sobre o APP",
        })}
      />
      <TabOneStack.Screen
        name="UserEditScreen"
        component={UserEditScreen}
        options={({ route }) => ({ 
          title: "Editar Perfil",
        })}
      />
      <TabOneStack.Screen
        name="Users"
        component={UsersScreen}
        options={({ route }) => ({ 
          title: "Usuários",
        })}
      />
      <TabOneStack.Screen
        name="Error"
        component={ErrorScreen}
        options={({ route }) => ({ 
          title: "Sugerir ou Reportar Erro",
        })}
      />
      <TabOneStack.Screen
        name="ErrorList"
        component={ErrorsListScreen}
        options={({ route }) => ({ 
          title: "Sugestões ou Erros",
        })}
      />
      <TabOneStack.Screen
        name="Logins"
        component={LoginsScreen}
        options={({ route }) => ({ 
          title: "Logins",
        })}
      />
    </TabConfigsStack.Navigator>
  );
}
