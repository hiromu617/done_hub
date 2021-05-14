import React, {
  useState,
  useEffect,
  useRef,
  useReducer,
  useContext,
} from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import HomeScreen from "./src/modules/Home/components/HomeScreen";
import ProfileScreen from "./src/modules/Profile/components/ProfileScreen";
import SearchScreen from "./src/modules/Search/components/SearchScreen";
import TodoScreen from "./src/modules/Todo/components/TodoScreen";
import NotificationScreen from "./src/modules/Notification/components/NotificationScreen";
import { createSwitchNavigator } from "@react-navigation/compat";
import DashboardScreen from "./src/modules/Auth/DashboardScreen";
import LoginScreen from "./src/modules/Auth/LoginScreen";
import LoadingScreen from "./src/modules/Auth/LoadingScreen";
import TermsScreen from "./src/modules/Auth/TermsScreen";
import PolicyScreen from "./src/modules/Auth/PolicyScreen";
import { firebaseConfig } from "./config";
import firebase from "firebase";
import User from "./src/modules/Profile/objects/User";
import { storeUser, getUser } from "./src/modules/Todo/Storage";
import { RootSiblingParent } from "react-native-root-siblings";
import { Icon, Badge } from "react-native-elements";
import { Subscription } from "@unimodules/core";
import * as Notifications from "expo-notifications";
import axios from "./src/constants/axios";
import reducer from "./notificationReducer";

const initialUser: User = {
  uid: null,
  name: null,
  profile: null,
  hub_list: [],
  id: 0,
};
function userReducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      let newUser: User = {
        uid: action.data.uid,
        name: action.data.displayName,
        profile: "",
        hub_list: [],
        id: 1,
      };
      alert(newUser);
      // console.log(newUser)
      storeUser(newUser);
      state = newUser;
      return newUser;
    default:
      return state;
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

const SiteProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialUser);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

firebase.initializeApp(firebaseConfig);

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen: LoadingScreen,
  LoginScreen: LoginScreen,
  PolicyScreen: PolicyScreen,
  TermsScreen: TermsScreen,
  DashboardScreen: DashboardScreen,
  MyTabs: MyTabs,
});

const Tab = createBottomTabNavigator();

export const CountContext = React.createContext(
  {} as {
    notificationCount: number;
    setNotificationCount: React.Dispatch<React.SetStateAction<number>>;
  }
);

function MyTabs() {
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    fetchNotificationCount();
  }, []);

  const fetchNotificationCount = async () => {
    getUser().then((data) => {
      axios
        .get("/api/notifications_count/" + data.uid)
        .then((res) => {
          console.log("---------------");
          console.log(res.data);
          // dispatch({type: 'set', count: res.data})
          setNotificationCount(res.data);
        })
        .catch((e) => console.log(e));
    });
  };
  return (
    <CountContext.Provider value={{ notificationCount, setNotificationCount }}>
      <Tab.Navigator
        initialRouteName="Todo"
        tabBarOptions={{
          activeTintColor: "#3B82F6",
          showLabel: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarLabel: "Search",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="search" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Todo"
          component={TodoScreen}
          options={{
            tabBarLabel: "Todo",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="check-square-o" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Notification"
          component={NotificationScreen}
          options={{
            // tabBarBadge: notificationCount,
            tabBarLabel: "Notification",
            tabBarIcon: ({ color, size }) => (
              <View>
                {notificationCount > 0 &&
                <Badge
                  status="primary"
                  containerStyle={{ position: "absolute", top: 0, right: 0 }}
                />
                }
                <Icon
                  name="bell-outline"
                  size={size}
                  color={color}
                  type="material-community"
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: "Profile",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account"
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </CountContext.Provider>
  );
}

export default function App() {
  const [notification, setNotification] =
    useState<Notifications.Notification>();
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  useEffect(() => {
    // 通知を受信した時の振る舞いを設定
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    // アプリがフォアグラウンドの状態で通知を受信したときに起動
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // ユーザーが通知をタップまたは操作したときに発生します
    // （アプリがフォアグラウンド、バックグラウンド、またはキルされたときに動作します）
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // alert('ユーザーが通知をタップしました')
        console.log(response);
      });

    // アンマウント時にリスナーを削除
    return () => {
      const notification = notificationListener.current;
      notification &&
        Notifications.removeNotificationSubscription(notification);
      const response = responseListener.current;
      response && Notifications.removeNotificationSubscription(response);
    };
  }, []);

  return (
    <RootSiblingParent>
      <SiteProvider>
        <NavigationContainer>
          <AppSwitchNavigator />
        </NavigationContainer>
      </SiteProvider>
    </RootSiblingParent>
  );
}
