import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons,FontAwesome} from '@expo/vector-icons';
import HomeScreen from './src/modules/Home/components/HomeScreen'
import ProfileScreen from './src/modules/Profile/components/ProfileScreen'
import SearchScreen from './src/modules/Search/components/SearchScreen'
import TodoScreen from './src/modules/Todo/components/TodoScreen'
import { createSwitchNavigator} from '@react-navigation/compat';
import DashboardScreen from './src/modules/Auth/DashboardScreen'
import LoginScreen from './src/modules/Auth/LoginScreen'
import LoadingScreen from './src/modules/Auth/LoadingScreen'
import {firebaseConfig} from './config'
import firebase from 'firebase'

firebase.initializeApp(firebaseConfig);

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen: LoadingScreen,
  LoginScreen: LoginScreen,
  DashboardScreen: DashboardScreen,
  MyTabs: MyTabs,
})

const Tab = createBottomTabNavigator();
function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Todo"
      tabBarOptions={{
        activeTintColor: '#e91e63',
        showLabel: false
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="search"  size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Todo"
        component={TodoScreen}
        options={{
          tabBarLabel: 'Todo',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="check-square-o" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <AppSwitchNavigator/>
    </NavigationContainer>
    // <NavigationContainer>
    //   <MyTabs/>
    // </NavigationContainer>
  );
}
