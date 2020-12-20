import AsyncStorage from '@react-native-async-storage/async-storage';

export const TOKEN_KEY = "@token:coletanea";

export const onSignIn = async auth => {
  console.log("vio aqui")
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

export const onSignOut = () => {
  AsyncStorage.removeItem(TOKEN_KEY)
  AsyncStorage.removeItem("user")
  return Promise.resolve(true)
}

export const isSignedIn = async () => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  return (token !== null) ? true : false;
};