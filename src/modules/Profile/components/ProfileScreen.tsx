import React, {useState, useEffect} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileHome from './ProfileHome'
import Detail from './Detail'

const Stack = createStackNavigator();

function ProfileScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileHome" component={ProfileHome} />
      <Stack.Screen name="Detail" component={Detail} />
    </Stack.Navigator>
  );
}

export default ProfileScreen