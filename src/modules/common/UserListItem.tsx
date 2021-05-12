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

const UserListItem: React.FC = (props) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [userData, setData] = useState(user);
  const navigation = useNavigation();
  const { user } = props;

  useEffect(() => {
    getSource();
    getUserData();
  }, []);

  const getUserData = useCallback(() => {
    getUser().then((data) => {
      setData(data);
    });
  }, [userData]);

  const getAvatar = () => {
    return new Promise((resolve) => {
      var storage = firebase.storage();
      var storageRef = storage.ref();
      var spaceRef = storageRef.child(`images/${user.uid}_200x200.jpg`);
      spaceRef
        .getDownloadURL()
        .then(function (url) {
          console.log("ファイルURLを取得");
          console.log(url);
          resolve(url);
        })
        .catch(function (error) {
          // Handle any errors
          console.log("getTokoImage 画像を取得する");
          console.log(error);
        });
    });
  };

  const getSource = () => {
    getAvatar().then((res) => {
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
        if (userData.id === user.id) {
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
        </Text>
      </ListItem.Content>
    </ListItem>
  );
};

export default UserListItem;
