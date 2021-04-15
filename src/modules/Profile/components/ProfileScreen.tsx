import React, {useState, useEffect} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileHome from './ProfileHome'
import Detail from './Detail'
import Following from './Following'
import Follower from './Follower'
import UserPage from '../../common/UserPage'

const Stack = createStackNavigator();

function ProfileScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileHome" component={ProfileHome} />
      <Stack.Screen name="Detail" component={Detail} />
      <Stack.Screen name="Following" component={Following} />
      <Stack.Screen name="Follower" component={Follower} />
      <Stack.Screen name="UserPage" component={UserPage} />
    </Stack.Navigator>
  );
}

export default ProfileScreen