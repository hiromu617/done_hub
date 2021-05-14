import React, { useState, useEffect, useRef } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  ScrollView,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import axios from "../../../constants/axios";
import { getUser } from "../../Todo/Storage";
import { useNavigation, useScrollToTop } from "@react-navigation/native";
import DonePost from "../../common/DonePost";
import Detail from "../../common/Detail";
import UserPage from "../../common/UserPage";
import Following from "../../common/Following";
import Follower from "../../common/Follower";

const FeedOfFollowStack = createStackNavigator();

function FeedOfFollow() {
  return (
    <FeedOfFollowStack.Navigator headerMode="none">
      <FeedOfFollowStack.Screen
        name="Feed"
        component={FeedOfFollowScreen}
        options={{
          headerShown: false,
        }}
      />
      <FeedOfFollowStack.Screen
        name="Detail"
        component={Detail}
        options={{
          title: "投稿",
          gestureDirection: "horizontal",
          headerBackTitleVisible: false,
        }}
      />
      <FeedOfFollowStack.Screen
        name="LikedUsers"
        component={Following}
        options={{
          title: "いいねしたユーザー",
          gestureDirection: "horizontal",
          headerBackTitleVisible: false,
        }}
      />
      <FeedOfFollowStack.Screen
        name="Following"
        component={Following}
        options={{
          title: "フォロー中",
          gestureDirection: "horizontal",
          headerBackTitleVisible: false,
        }}
      />
      <FeedOfFollowStack.Screen
        name="Follower"
        component={Follower}
        options={{
          title: "フォロワー",
          gestureDirection: "horizontal",
          headerBackTitleVisible: false,
        }}
      />
      <FeedOfFollowStack.Screen
        name="UserPage"
        component={UserPage}
        options={{
          title: "ユーザー",
          gestureDirection: "horizontal",
          headerBackTitleVisible: false,
        }}
      />
    </FeedOfFollowStack.Navigator>
  );
}

function FeedOfFollowScreen() {
  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useState(null);
  const [refreshState, setRefreshData] = useState(false);
  const [feed, setFeed] = useState();
  const [pageData, setPageData] = useState(2);
  const [imageSrc, setImageSrc] = useState(null);
  const ref = useRef(null);

  useScrollToTop(ref);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    // setFeed(null);
    setImageSrc(null);
    setRefreshData(true);
    getUser().then((data) => {
      if (data.uid !== undefined) {
        setCurrentUser(data);
        // console.log(data)
      }
      // console.log("----------------------")
      // console.log(data)
      axios
        .get("/api/users/" + data.uid + "/feed", {
          params: {
            page: 1,
          },
        })
        .then((res) => {
          setPageData(2);
          // console.log(res.data);
          // console.log("----------------------")
          // let postsData = res.data.done_posts.reverse()
          // setUserPostData(postsData)
          setFeed(res.data);
          setRefreshData(false);
        })
        .catch((e) => console.log(e));
    });
  };

  const fetchData = async () => {
    axios
      .get("/api/users/" + currentUser.uid + "/feed", {
        params: {
          page: pageData,
        },
      })
      .then((res) => {
        if (res.data.length === 0) return;
        setPageData(pageData + 1);
        console.log("----------------------");
        console.log(res.data);
        let Data = feed;
        let newData = Data.concat(res.data);
        setFeed(newData);
      });
  };

  return (
    <SafeAreaView>
      <FlatList
        ref={ref}
        refreshControl={
          <RefreshControl
            refreshing={refreshState}
            onRefresh={() => refreshData()}
          />
        }
        showsVerticalScrollIndicator={false}
        data={feed}
        keyExtractor={(item) => item?.id?.toString()}
        renderItem={({ item }) => {
          return <DonePost post={item} currentUser={currentUser} image={null} />;
        }}
        onEndReached={fetchData}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  );
}

export default FeedOfFollow;
