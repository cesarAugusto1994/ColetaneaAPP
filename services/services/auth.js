import AsyncStorage from '@react-native-async-storage/async-storage';

export const TOKEN_KEY = "@token:coletanea";

export const onSignIn = async auth => {
  await AsyncStorage.setItem(TOKEN_KEY, auth.jwt)
  await AsyncStorage.setItem("user", JSON.stringify(auth.user))
  return Promise.resolve(true)
};

export const getToken = async () => {
  const response = await AsyncStorage.getItem(TOKEN_KEY)
  return `Bearer ${response}`
};

export const getUser = async () => {
  const response = await AsyncStorage.getItem("user")
  return response
};

export const setUser = async (user) => {
  await AsyncStorage.setItem("user", JSON.stringify(user))
};

export const onSignOut = () => {
  AsyncStorage.removeItem(TOKEN_KEY)
  AsyncStorage.removeItem("user")
  return Promise.resolve(true)
}

export const isSignedIn = async () => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  return (token !== null) ? true : false;
};

export const setDisplayMode = async (mode) => {
  await AsyncStorage.setItem("displaymode", mode)
};

export const getDisplayMode = async () => {
  const response = await AsyncStorage.getItem("displaymode")
  return response
};