import React, { useReducer, useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { Text, Avatar, Button, Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";

function OtherProfileInfo(props) {
  const {
    userData,
    imageSrc,
    followData,
    isFollowed,
    follow,
    unfollow,
    isCurrentUser,
  } = props;
  console.log(followData);
  const navigation = useNavigation();
  if (!userData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <View>
      <View
        style={{
          padding: 10,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{}}>
          {imageSrc && (
            <Avatar
              rounded
              source={{
                uri: imageSrc,
              }}
              size="large"
              containerStyle={{ backgroundColor: "gray" }}
            />
          )}
          {!imageSrc && (
            <Avatar
              rounded
              title={userData.name[0]}
              size="large"
              containerStyle={{ backgroundColor: "gray" }}
            />
          )}
          <Text h4 style={{ fontWeight: "bold", margin: 5 }}>
            {userData.name}
          </Text>
        </View>
        <View>
          {!isCurrentUser && isFollowed && (
            <Button
              title="follow中"
              style={{ margin: 10 }}
              buttonStyle={{ borderRadius: 18, paddingHorizontal: 10 }}
              titleStyle={{ fontSize: 16 }}
              type="solid"
              onPress={() => unfollow()}
            />
          )}
          {!isCurrentUser && !isFollowed && (
            <Button
              title="followする"
              style={{ margin: 10 }}
              buttonStyle={{ borderRadius: 18, paddingHorizontal: 10 }}
              titleStyle={{ fontSize: 16 }}
              type="outline"
              onPress={() => follow()}
            />
          )}
        </View>
      </View>
      <View>
        <Text>
          <Button
            icon={<Icon name="tag" color="#60A5FA" size={20} />}
            type="clear"
            titleStyle={{ fontSize: 14, color: "#60A5FA" }}
            buttonStyle={{ marginLeft: 7 }}
            title="プログラミング"
          />
        </Text>
        <Text style={{ paddingBottom: 15, paddingHorizontal: 10 }}>
          {userData.profile}
        </Text>
        <Text style={{ marginLeft: 10 }}>
          <TouchableOpacity
            onPress={() =>
              navigation.push("Following", {
                following: followData.following,
              })
            }
          >
            <Text style={{ fontWeight: "bold", marginRight: 10 }}>
              {followData.following.length} フォロー
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.push("Follower", { follower: followData.follower })
            }
          >
            <Text style={{ fontWeight: "bold" }}>
              {followData.follower.length} フォロワー
            </Text>
          </TouchableOpacity>
        </Text>
      </View>
    </View>
  );
}

export default OtherProfileInfo;
