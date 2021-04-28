import React, {useReducer, useContext} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons,FontAwesome} from '@expo/vector-icons';
import HomeScreen from './src/modules/Home/components/HomeScreen'
import ProfileScreen from './src/modules/Profile/components/ProfileScreen'
import SearchScreen from './src/modules/Search/components/SearchScreen'
import TodoScreen from './src/modules/Todo/components/TodoScreen'
import NotificationScreen from './src/modules/Notification/components/NotificationScreen'
import { createSwitchNavigator} from '@react-navigation/compat';
import DashboardScreen from './src/modules/Auth/DashboardScreen'
import LoginScreen from './src/modules/Auth/LoginScreen'
import LoadingScreen from './src/modules/Auth/LoadingScreen'
import {firebaseConfig} from './config'
import firebase from 'firebase'
import User from './src/modules/Profile/objects/User'
import { storeUser, getUser } from './src/modules/Todo/Storage'
import { RootSiblingParent } from 'react-native-root-siblings';

const initialUser: User = {
  uid: null,
  name: null,
  profile: null,
  hub_list: [],
  id: 0
}
function userReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      let newUser: User = {
        uid: action.data.uid,
        name: action.data.displayName,
        profile: '',
        hub_list: [],
        id: 1
      }
      alert(newUser)
      // console.log(newUser)
      storeUser(newUser)
      state = newUser
      return newUser;
    default : 
      return state
  }

}
// function createCtx<ContextType>() {
//   const ctx = React.createContext<ContextType | undefined>(undefined);
//   const useCtx = () => {
//     const c = React.useContext(ctx);
//     if (!c) throw new Error("useCtx must be inside a Provider with a value");
//     return c;
//   };
//   return [useCtx, ctx.Provider] as const;
// }

export const UserContext = React.createContext({});

const SiteProvider = ({children}) => {
  const [state, dispatch] = useReducer(userReducer, initialUser)
  return <UserContext.Provider value={{state, dispatch}}>
    {children}
  </UserContext.Provider>
}



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
        activeTintColor: '#3B82F6',
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
        name="Notification"
        component={NotificationScreen}
        options={{
          tabBarLabel: 'Notification',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="bell"  size={size} color={color} />
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
    <RootSiblingParent> 
    <SiteProvider>
      <NavigationContainer>
        <AppSwitchNavigator/>
      </NavigationContainer>
    </SiteProvider>
    </RootSiblingParent> 
    // <NavigationContainer>
    //   <MyTabs/>
    // </NavigationContainer>
  );
}
