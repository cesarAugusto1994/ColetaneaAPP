import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import TabOneScreen from "../screens/TabOneScreen";
import CategoriesScreen from "../screens/CategoriesScreen";
import SongsScreen from "../screens/SongsScreen";
import Songscreen from "../screens/SongScreen";
import SearchScreen from "../screens/SearchScreen";
import TabTwoScreen from "../screens/TabTwoScreen";
import TabConfigsScreen from "../screens/TabConfigsScreen";
import BookScreen from "../screens/BookScreen";
import BooksScreen from "../screens/BooksScreen";
import ChaptersScreen from "../screens/ChaptersScreen";
import VerseScreen from "../screens/VerseScreen";

import GroupScreen from "../screens/GroupScreen";
import GroupUsersScreen from "../screens/GroupUsersScreen";
import GroupListsScreen from "../screens/GroupListsScreen";
import GroupListDetailsScreen from "../screens/GroupListDetailsScreen";
import GroupListAddScreen from "../screens/GroupListAddScreen";

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
      <BottomTab.Screen
        name="Bíblias"
        component={TabBookNavigator}
        options={{
          tabBarIcon: ({ color }) =>
            <TabBarIcon name="ios-book-outline" color={color} />
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
        options={{ headerTitle: "Coletanea ICM" }}
      />
      <TabOneStack.Screen
        name="Categorias"
        component={CategoriesScreen}
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
    </TabConfigsStack.Navigator>
  );
}
