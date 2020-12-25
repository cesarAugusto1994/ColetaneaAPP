import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { Platform } from 'react-native';
import { getUser, getToken, setUser } from '../services/services/auth';
import api from '../services/api/axios';

async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
}

export async function sendPushNotification(expoPushToken: String | Array<String>, messageBody: { title: any; body: any; }) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: messageBody.title,
    body: messageBody.body,
    data: { data: '' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

export async function registerUserToken(expoPushToken: String) {

  const stringiedUser = await getUser()
  const user = JSON.parse(stringiedUser)

  try {
    const response = await api.put(`users/${user.id}`, {
      expo_token: expoPushToken
    }, {
      headers: {
        Authorization: await getToken(),
      },
    });
    if (response) {
      setUser(response.data)
    }
  } catch (error) {
    console.log('error', JSON.stringify(error.response));
  }

}

export default registerForPushNotificationsAsync