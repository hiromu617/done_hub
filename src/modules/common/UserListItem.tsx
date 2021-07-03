import React, { useEffect, useState, useCallback } from "react";
import { ListItem, Avatar, Icon, Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import firebase from "firebase";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import {
  TouchableHighlight,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { getUser } from "../Todo/Storage";
import { getAvatar } from "./CommonUtil";

type Props = {
  user;
  // currentUser;
};

const UserListItem: React.FC<Props>  = (props) => {
  const { user } = props;
  const [imageSrc, setImageSrc] = useState(null);
  const [currentUser, setCurrentUser] = useState();
  const navigation = useNavigation();

  useEffect(() => {
    getSource();
    getCurrentUser();
  }, []);

  const getCurrentUser = useCallback(() => {
    getUser().then((data) => {
      setCurrentUser(data);
    });
  }, [currentUser]);

  const getSource = () => {
    getAvatar(user.uid).then((res) => {
      setImageSrc(res);
    });
  };
  return (
    <ListItem
      // onPress={() =>
      //   navigation.push("UserPage", {
      //     user: user,
      //   })
      // }
      onPress={() => {
        if (currentUser.id === user.id) {
          navigation.navigate("Profile");
        } else {
          navigation.push("UserPage", {
            user: user,
          });
        }
      }}
      topDivider
    >
      <Avatar
        title={user.name[0]}
        source={{
          uri: imageSrc,
        }}
        rounded
        containerStyle={{ backgroundColor: "gray" }}
      />
      <ListItem.Content>
        <ListItem.Title>{user.name}</ListItem.Title>
        <Text style={{ marginTop: 10 }}>
          {user.hub_list.map((l, i) => (
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
      </ListItem.Content>
    </ListItem>
  );
};

export default UserListItem;
