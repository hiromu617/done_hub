import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FeedOfFollow from './FeedOfFollow'
import FeedOfHub from './FeedOfHub'
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Tab = createMaterialTopTabNavigator();

function TopTabs() {
  return (
    <Tab.Navigator 
    style={{flex: 1}}
    swipeEnabled={false}
    lazy
    >
      <Tab.Screen 
        name="Follow"
        component={FeedOfFollow} 
        options={{
          title: 'フォロー中',
        }}
      />
      <Tab.Screen 
        name="Hub" 
        component={FeedOfHub} 
      />
    </Tab.Navigator>
  );
}

function HomeScreen(){
  return (
    <SafeAreaProvider>
      <View style={{height: '3%'}}></View>
      <TopTabs/>
    </SafeAreaProvider>
  )
}

export default HomeScreen