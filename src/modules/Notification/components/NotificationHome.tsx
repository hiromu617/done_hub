import React, { useState, useEffect, useReducer, useContext } from "react";
import {
  Text,
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { getUser } from "../../Todo/Storage";
import { useNavigation } from "@react-navigation/native";
import axios from "../../../constants/axios";
import { ListItem, Divider, Overlay, Icon } from "react-native-elements";
import firebase from "firebase";
import { useFocusEffect } from "@react-navigation/native";
import { CountContext } from "../../../../App";

function NotificationHome() {
  // const {state} = useContext(SiteContext);
  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useState();
  const [refreshState, setRefreshData] = useState(false);
  const [notificationData, setNotificationData] = useState([]);
  const [pageData, setPageData] = useState(2);
  const { notificationCount, setNotificationCount } = useContext(CountContext);

  useEffect(() => {
    setNotificationCount(0)
    refreshData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      refreshData();
    }, [])
  );

  const parseDate = (val) => {
    return val
      .toString()
      .replace(
        /([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2})([\w|:|.|+]*)/,
        "$2/$3 $4:$5"
      );
  };

  const refreshData = () => {
    setRefreshData(true);
    getUser().then((data) => {
      if (data.uid !== undefined) {
        setCurrentUser(data);
        console.log(data);
      }
      console.log("----------------------");
      // console.log(data)
      axios
        .get("/api/notifications", {
          params: {
            uid: data.uid,
            page: 1,
          },
        })
        .then((res) => {
          setPageData(2);
          setRefreshData(false);
          setNotificationData(res.data);
        });
    });
  };
  const fetchData = () => {
    axios
      .get("/api/notifications", {
        params: {
          uid: currentUser.uid,
          page: pageData,
        },
      })
      .then((res) => {
        if (res.data.length === 0) return;
        setPageData(pageData + 1);
        let Data = notificationData;
        if (Data !== undefined) {
          let newData = Data.concat(res.data);
          setNotificationData(newData);
        }
      });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshState}
            onRefresh={() => refreshData()}
          />
        }
        showsVerticalScrollIndicator={false}
        data={notificationData}
        keyExtractor={(item) => item?.id?.toString()}
        onEndReached={fetchData}
        onEndReachedThreshold={1.0}
        renderItem={({ item }) => {
          const color = !item.checked ? "#EEF2FF" : "white";
          if (item.action === "like") {
            return (
              <ListItem
                key={item.id}
                bottomDivider
                onPress={async () => {
                  navigation.navigate("Detail", {
                    post: item.done_post,
                    currentUser: currentUser,
                    initialLikeNum: item.done_post.likes.length,
                  });
                }}
                containerStyle={{ backgroundColor: color }}
              >
                <Icon
                  name="heart"
                  type="font-awesome-5"
                  size={24}
                  color="#F87171"
                  solid
                />
                <ListItem.Content style={{ paddingVertical: 15 }}>
                  <ListItem.Title style={{ fontSize: 16 }}>
                    {item.visiter.name}???????????????????????????????????????
                  </ListItem.Title>
                </ListItem.Content>
                <Text
                  style={{ fontSize: 12, textAlign: "right", color: "#1F2937" }}
                >
                  {parseDate(item.created_at)}
                </Text>
              </ListItem>
            );
          }
          if (item.action === "reply") {
            return (
              <ListItem
                key={item.id}
                bottomDivider
                onPress={async () => {
                  navigation.navigate("Detail", {
                    post: item.done_post,
                    currentUser: currentUser,
                    initialLikeNum: item.done_post.likes.length,
                  });
                }}
                containerStyle={{ backgroundColor: color }}
              >
                <Icon
                  name="comment"
                  type="font-awesome-5"
                  size={24}
                  color="gray"
                  solid
                />
                <ListItem.Content style={{ paddingVertical: 15 }}>
                  <ListItem.Title style={{ fontSize: 16 }}>
                    {item.visiter.name}????????????????????????????????????
                  </ListItem.Title>
                </ListItem.Content>
                <Text
                  style={{ fontSize: 12, textAlign: "right", color: "#1F2937" }}
                >
                  {parseDate(item.created_at)}
                </Text>
              </ListItem>
            );
          }
          if (item.action === "follow") {
            return (
              <ListItem
                key={item.id}
                bottomDivider
                onPress={async () => {
                  navigation.navigate("UserPage", {
                    user: item.visiter,
                  });
                }}
                containerStyle={{ backgroundColor: color }}
              >
                <Icon
                  name="user"
                  type="font-awesome-5"
                  size={24}
                  color="#3B82F6"
                  solid
                />
                <ListItem.Content style={{ paddingVertical: 15 }}>
                  <ListItem.Title style={{ fontSize: 16 }}>
                    {item.visiter.name}?????????????????????????????????????????????
                  </ListItem.Title>
                </ListItem.Content>
                <Text
                  style={{ fontSize: 12, textAlign: "right", color: "#1F2937" }}
                >
                  {parseDate(item.created_at)}
                </Text>
              </ListItem>
            );
          }
        }}
      />
    </SafeAreaView>
  );
}

export default NotificationHome;
