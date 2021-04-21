import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Detail from '../../common/Detail'
import Following from '../../common/Following'
import Follower from '../../common/Follower'
import UserPage from '../../common/UserPage'
import SearchHome from './SearchHome'

const SearchStack = createStackNavigator();

function SearchScreen() {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen name="SearchHome" component={SearchHome} />
      <SearchStack.Screen name="Detail" component={Detail} />
      <SearchStack.Screen name="Following" component={Following} />
      <SearchStack.Screen name="Follower" component={Follower} />
      <SearchStack.Screen name="UserPage" component={UserPage} />
    </SearchStack.Navigator>
  );
}

export default SearchScreen
