import React, { useReducer, useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  Alert,
} from "react-native";
import { Text, Avatar, Button, Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { block } from "react-native-reanimated";
import { slackToken } from "../../../config";
import Toast from "react-native-root-toast";

function OtherProfileInfo(props) {
  const {
    userInfo,
    imageSrc,
    followData,
    isFollowed,
    follow,
    unfollow,
    doneCounts,
    blockUser,
    unblockUser,
    blockState,
    reportUser,
    toggleCalendar,
  } = props;
  const [blockMenu, setBlockMenu] = useState(false);
  const navigation = useNavigation();

  if (!userInfo) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <View style={{ backgroundColor: "white" }}>
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
              title={userInfo.name[0]}
              size="large"
              containerStyle={{ backgroundColor: "gray" }}
            />
          )}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ maxWidth: "85%" }}>
              <Text h4 style={{ fontWeight: "bold", margin: 5 }}>
                {userInfo.name}
              </Text>
            </View>
            <View>
              {blockMenu ? (
                <Icon
                  size={20}
                  style={{ paddingLeft: 20 }}
                  name="caret-up"
                  type="font-awesome"
                  onPress={() => setBlockMenu(!blockMenu)}
                />
              ) : (
                <Icon
                  style={{ paddingLeft: 20 }}
                  size={20}
                  name="caret-down"
                  type="font-awesome"
                  onPress={() => setBlockMenu(!blockMenu)}
                />
              )}
            </View>
          </View>
          {!blockState.block && blockMenu && (
            <Button
              title="ブロックする"
              titleStyle={{ color: "#EF4444" }}
              type="clear"
              onPress={() => blockUser()}
            />
          )}
          {blockState.block && blockMenu && (
            <Button
              title="ブロック解除する"
              titleStyle={{ color: "#EF4444" }}
              type="clear"
              onPress={() => unblockUser()}
            />
          )}
          {blockMenu && (
            <Button
              title="報告"
              type="clear"
              titleStyle={{ color: "#EF4444" }}
              onPress={() => reportUser()}
            />
          )}
        </View>
        <View style={{ position: "absolute", right: 0 }}>
          {blockState.block && (
            <Button
              title="ブロック中"
              style={{ margin: 10 }}
              disabledStyle={{
                borderRadius: 18,
                paddingHorizontal: 10,
                backgroundColor: "#F87171",
              }}
              disabledTitleStyle={{ fontSize: 16, color: "white" }}
              type="solid"
              disabled
            />
          )}
          {isFollowed && !blockState.block && !blockState.blocked && (
            <Button
              title="follow中"
              style={{ margin: 10 }}
              buttonStyle={{
                borderRadius: 18,
                paddingHorizontal: 10,
                backgroundColor: "#3B82F6",
              }}
              titleStyle={{ fontSize: 16 }}
              type="solid"
              onPress={() => unfollow()}
            />
          )}
          {!isFollowed && !blockState.block && !blockState.blocked && (
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
      <View style={{ paddingHorizontal: 12, paddingBottom: 10 }}>
        <Text>
          {userInfo.hub_list.map((l, i) => (
            <TouchableOpacity>
              <LinearGradient
                start={[0, 1]}
                end={[1, 0]}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderRadius: 13,
                  paddingHorizontal: 11,
                  paddingVertical: 5,
                  margin: 1.5,
                }}
                colors={["#2563EB", "#1D4ED8"]}
              >
                <Icon name="tag" color="white" size={16} />
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    lineHeight: 14,
                    fontSize: 14,
                  }}
                >
                  {l}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </Text>
        <Text style={{ paddingTop: 10 }}>
          {userInfo.college && (
            <Text style={{ color: "#4B5563" }}>🏫{userInfo.college} </Text>
          )}
          {userInfo.faculty && (
            <Text style={{ color: "#4B5563" }}>{userInfo.faculty} </Text>
          )}
          {userInfo.department && (
            <Text style={{ color: "#4B5563" }}>{userInfo.department}</Text>
          )}
        </Text>
        <Text style={{ paddingTop: 5, paddingBottom: 10 }}>
          {userInfo.profile}
        </Text>
        <Text>
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
          <TouchableOpacity onPress={() => toggleCalendar()}>
            <Text style={{ fontWeight: "bold" }}> {doneCounts} Done🗓</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </View>
  );
}

export default OtherProfileInfo;
