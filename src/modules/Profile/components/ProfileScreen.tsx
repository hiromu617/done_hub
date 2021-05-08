import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileHome from "./ProfileHome";
import Detail from "../../common/Detail";
import Following from "../../common/Following";
import Follower from "../../common/Follower";
import UserPage from "../../common/UserPage";
import HubSelect from "../../common/HubSelect";

const Stack = createStackNavigator();

function ProfileScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileHome"
        component={ProfileHome}
        options={{
          title: "プロフィール",
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
        name="LikedUsers"
        component={Following}
        options={{
          title: "いいねしたユーザー",
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
        name="Follower"
        component={Follower}
        options={{
          title: "フォロワー",
          gestureDirection: "horizontal",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="BlockUsers"
        component={Follower}
        options={{
          title: "ブロックしたユーザー",
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
      <Stack.Screen
        name="HubSelect"
        component={HubSelect}
        options={{
          title: "Hubの編集",
          gestureDirection: "horizontal",
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default ProfileScreen;
