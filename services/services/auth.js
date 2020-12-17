import AsyncStorage from '@react-native-async-storage/async-storage';

export const TOKEN_KEY = "@token:coletanea";

export const onSignIn = auth => {
  AsyncStorage.setItem(TOKEN_KEY, auth.jwt)
  AsyncStorage.setItem("user", JSON.stringify(auth.user))
  return Promise.resolve()
};

export const getToken = async () => {
  const response = await AsyncStorage.getItem(TOKEN_KEY)
  return `Bearer ${response}`
};

export const onSignOut = () => {
  AsyncStorage.removeItem(TOKEN_KEY)
  AsyncStorage.removeItem("user")
}

export const isSignedIn = async () => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  return (token !== null) ? true : false;
};