import { AsyncStorage } from '@react-native-async-storage/async-storage';

export const TOKEN_KEY = "@token";

export const onSignIn = tokenKey => AsyncStorage.setItem(TOKEN_KEY, tokenKey);

export const onSignOut = () => AsyncStorage.removeItem(TOKEN_KEY);

export const isSignedIn = async () => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);

  return (token !== null) ? true : false;
};