/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import messaging from '@react-native-firebase/messaging';

import React, {useEffect} from 'react';
import {Alert, Text, View} from 'react-native';
import {PermissionsAndroid} from 'react-native';

const getToken = async () => {
  await messaging().registerDeviceForRemoteMessages();
  const token = await messaging().getToken();
  console.log('fcm: ', token);
};

const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  getToken();
};

const firebaseNotificationHandlers = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage,
    );
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage,
        );
      }
    });
};

function App(): JSX.Element {
  useEffect(() => {
    requestUserPermission();
    firebaseNotificationHandlers();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(' on message foreground', remoteMessage);
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);
  return (
    <View style={{height: '100%', backgroundColor: 'yellow'}}>
      <Text>App.tsx</Text>
    </View>
  );
}

export default App;
