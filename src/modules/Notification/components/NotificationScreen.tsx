import React, {useState, useEffect} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Detail from '../../common/Detail'
import Following from '../../common/Following'
import Follower from '../../common/Follower'
import UserPage from '../../common/UserPage'
import NotificationHome from './NotificationHome'
const Stack = createStackNavigator();

function NotificationScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Notification" component={NotificationHome} />
      <Stack.Screen name="Detail" component={Detail} />
      <Stack.Screen name="Following" component={Following} />
      <Stack.Screen name="Follower" component={Follower} />
      <Stack.Screen name="UserPage" component={UserPage} />
    </Stack.Navigator>
  );
}

export default NotificationScreen