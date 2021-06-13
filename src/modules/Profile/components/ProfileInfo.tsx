import React, { useReducer, useContext, useState, useEffect } from "react";
import {
  TouchableHighlight,
  StyleSheet,
  View,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { Text, Button, ButtonGroup, Avatar, Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { deleteData } from "../../Todo/Storage";

function ProfileInfo(props) {
  const {
    currentUser,
    toggleModal,
    imageSrc,
    followData,
    doneCounts,
    toggleCalendar,
  } = props;
  // console.log(followData.following)
  // console.log(followData.follower)
  const navigation = useNavigation();
  if (!currentUser) {
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
              title={currentUser.name[0]}
              size="large"
              containerStyle={{ backgroundColor: "gray" }}
            />
          )}
          <Text h4 style={{ fontWeight: "bold", margin: 5 }}>
            {currentUser.name}
          </Text>
        </View>
        <View style={{ position: "absolute", right: 0 }}>
          <Button
            title="変更"
            style={{ margin: 10 }}
            buttonStyle={{
              borderRadius: 18,
              paddingHorizontal: 12,
              backgroundColor: "white",
            }}
            icon={
              <Icon name="cog" type="font-awesome" size={18} color="#3B82F6" />
            }
            titleStyle={{ fontSize: 16, marginLeft: 3 }}
            type="outline"
            onPress={toggleModal}
          />
        </View>
      </View>
      <View style={{ paddingHorizontal: 12, paddingBottom: 10 }}>
        <Text>
          {currentUser.hub_list.map((l, i) => (
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
                colors={["#0EA5E9", "#60A5FA"]}
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
          <TouchableOpacity
            onPress={() =>
              navigation.push("HubSelect", {
                user: currentUser,
              })
            }
          >
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
              colors={["transparent", "transparent"]}
            >
              <Text
                style={{
                  color: "#0EA5E9",
                  fontWeight: "bold",
                  lineHeight: 14,
                  fontSize: 14,
                }}
              >
                Hubを編集
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Text>
        <Text style={{ paddingTop: 10}}>
          {currentUser.college && <Text style={{color: "#4B5563" }}>🏫{currentUser.college} </Text>}
          {currentUser.faculty && <Text style={{color: "#4B5563" }}>{currentUser.faculty} </Text>}
          {currentUser.department && <Text style={{color: "#4B5563" }}>{currentUser.department}</Text>}
        </Text>
        <Text style={{ paddingTop: 5, paddingBottom: 10 }}>
          {currentUser.profile}
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
            <Text style={{ fontWeight: "bold" }}>  {doneCounts} Done🗓</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </View>
  );
}

export default ProfileInfo;
