import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName, Text } from 'react-native';

import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStackParamList } from '../types';
import SignInNavigator from '../screens/SigninScreen';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';
import {isSignedIn} from '../services/services/auth';

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {

  const [isLogged, setisLogged] = React.useState(null)

  const getIsLogged = async () => {
    const response = await isSignedIn()
    setisLogged(response)
  }

  React.useEffect(() => {
    getIsLogged()
  }, [])

  if(isLogged === null) return <Text>Aguarde....</Text>

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {
        !isLogged && <Stack.Screen name="SingIn" component={SignInNavigator} />
      }
      <Stack.Screen name="Root" component={BottomTabNavigator} />
      <Stack.Screen name="NotFound" component={SignInNavigator} options={{ title: 'Oops!' }} />
    </Stack.Navigator>
  );
}
