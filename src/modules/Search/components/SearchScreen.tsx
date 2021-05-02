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
      <SearchStack.Screen 
        name="SearchHome" 
        component={SearchHome} 
        options={{
          title: '検索',
          gestureDirection: 'horizontal',
          headerBackTitleVisible: false,
        }}
      />
      <SearchStack.Screen 
        name="Detail" 
        component={Detail} 
        options={{
          title: '投稿',
          gestureDirection: 'horizontal',
          headerBackTitleVisible: false,
        }}
      />
      <SearchStack.Screen 
        name="LikedUsers" 
        component={Following} 
        options={{
          title: 'いいねしたユーザー',
          gestureDirection: 'horizontal',
          headerBackTitleVisible: false
        }}
      />
      <SearchStack.Screen 
        name="Following" 
        component={Following} 
        options={{
          title: 'フォロー中',
          gestureDirection: 'horizontal',
          headerBackTitleVisible: false,
        }}
      />
      <SearchStack.Screen 
        name="Follower" 
        component={Follower} 
        options={{
          title: 'フォロワー',
          gestureDirection: 'horizontal',
          headerBackTitleVisible: false,
        }}
      />
      <SearchStack.Screen 
        name="UserPage" 
        component={UserPage} 
        options={{
          title: 'ユーザー',
          gestureDirection: 'horizontal',
          headerBackTitleVisible: false,
        }}
      />
    </SearchStack.Navigator>
  );
}

export default SearchScreen
