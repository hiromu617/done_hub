import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Detail from "../../common/Detail";
import Following from "../../common/Following";
import Follower from "../../common/Follower";
import UserPage from "../../common/UserPage";
import NotificationHome from "./NotificationHome";
const Stack = createStackNavigator();

function NotificationScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Notification"
        component={NotificationHome}
        options={{
          title: "通知",
          gestureDirection: "horizontal",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="Detail"
        component={Detail}
        options={{
          title: "投稿",
          gestureDirection: "horizontal",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="Following"
        component={Following}
        options={{
          title: "フォロー中",
          gestureDirection: "horizontal",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="LikedUsers"
        component={Following}
        options={{
          title: "いいねしたユーザー",
          gestureDirection: "horizontal",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="Follower"
        component={Follower}
        options={{
          title: "フォロワー",
          gestureDirection: "horizontal",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="UserPage"
        component={UserPage}
        options={{
          title: "ユーザー",
          gestureDirection: "horizontal",
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default NotificationScreen;
