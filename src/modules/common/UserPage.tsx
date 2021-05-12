import React, { useState, useEffect } from "react";
import {
  Text,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  View,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  Alert,
} from "react-native";
import { getUser } from "../Todo/Storage";
import { useNavigation } from "@react-navigation/native";
import axios from "../../constants/axios";
import DonePost from "./DonePost";
import { Icon, Divider, Overlay, Button } from "react-native-elements";
import firebase from "firebase";
import OtherProfileInfo from "./OtherProfileInfo";
import ProfileInfo from "../Profile/components/ProfileInfo";
import EditProfile from "../Profile/components/EditProfile";
import Toast from "react-native-root-toast";
import { slackToken } from "../../../config";
import { sendPushNotification } from "../../constants/pushNotificationFunc";
import Modal from "react-native-modal";
import DoneCalendar from './DoneCalendar'

function UserPage({ route }) {
  const { user } = route.params;
  const navigation = useNavigation();
  const [userData, setData] = useState(user);
  const [userInfo, setUserInfo] = useState(null);
  const [refreshState, setRefreshData] = useState(false);
  const [userPostsData, setUserPostData] = useState();
  const [pageData, setPageData] = useState(2);
  const [isFollowed, setIsFollowed] = useState(false);
  const [currentUserUid, setCurrentUserUid] = useState(0);
  const [isCurrentUser, setisCurrentUser] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [followData, setFollowData] = useState({ following: [], follower: [] });
  const [doneCounts, setDoneCounts] = useState(0);
  const [blockState, setBlockState] = useState({
    block: false,
    blocked: false,
  });
  const [reportState, setReportState] = useState(false);
  const [isShowCalendar, setIsShowCalendar] = useState(false);

  const toggleCalendar = () => {
    setIsShowCalendar(!isShowCalendar);
  };
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    refreshData();
    // getSource(userData)
  }, []);

  const getAvatar = (userData) => {
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
  const getSource = (userData) => {
    getAvatar(userData).then((res) => {
      setImageSrc(res);
    });
  };
  const refreshData = () => {
    // setUserPostData(null);
    setImageSrc(null);
    getSource(userData);

    setRefreshData(true);
    getUser().then((data) => {
      setData(data);
      setCurrentUserUid(data.uid);
      axios
        .get("/api/users/" + user.uid, {
          params: {
            currentUserUid: data.uid,
          },
        })
        .then((res) => {
          console.log(res.data);
          setUserInfo(res.data.user);
          setDoneCounts(res.data.done_counts);
          setIsFollowed(res.data.isFollowed);
          setBlockState(res.data.blockState);
          if (user.uid === currentUserUid) setisCurrentUser(true);
          setFollowData({
            following: res.data.following,
            follower: res.data.follower,
          });
        })
        .catch((e) => console.log(e));
    });

    // ユーザの最新の投稿を取得
    axios
      .get("/api/done_posts", {
        params: {
          page: 1,
          uid: user.uid,
        },
      })
      .then((res) => {
        setPageData(2);
        setUserPostData(res.data);
        setRefreshData(false);
      })
      .catch((e) => console.log(e));
  };

  const fetchData = () => {
    axios
      .get("/api/done_posts", {
        params: {
          page: pageData,
          uid: user.uid,
        },
      })
      .then((res) => {
        if (res.data.length === 0) return;
        setPageData(pageData + 1);
        // console.log("----------------------")
        // let postsData = res.data.done_posts.reverse()
        // setUserPostData(postsData)
        let Data = userPostsData;
        let newData = Data.concat(res.data);
        setUserPostData(newData);
      });
  };
  const unfollow = async () => {
    axios.delete("/api/relationships/" + userInfo.id, {
      params: {
        currentUserUid: currentUserUid,
      },
    });
    setIsFollowed(false);
    console.log("succsess unfollow");
  };
  const follow = async () => {
    if (user.uid === currentUserUid) return;
    axios.get("/api/relationships", {
      params: {
        currentUserUid: currentUserUid,
        id: userInfo.id,
      },
    });
    setIsFollowed(true);
    console.log("succsess follow");
    sendPushNotification(
      userInfo.expo_push_token,
      "Done Hub",
      `${userData.name}さんがフォローしました`
    );
  };

  const unblockUser = async () => {
    Alert.alert("ブロック解除", `ブロックを解除しますか？`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          axios.delete("/api/blocks/" + userInfo.id, {
            params: {
              currentUserUid: currentUserUid,
            },
          });
          setBlockState({ block: false, blocked: blockState.blocked });
          Toast.show("ブロックしました", {
            position: 50,
          });
        },
      },
    ]);
  };
  const blockUser = async () => {
    if (user.uid === currentUserUid) return;
    Alert.alert("ブロック", `${user.name}を本当にブロックしますか？`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          axios.get("/api/blocks", {
            params: {
              currentUserUid: currentUserUid,
              id: userInfo.id,
            },
          });
          setBlockState({ block: true, blocked: blockState.blocked });
          Toast.show("ブロックを解除しました", {
            position: 50,
          });
        },
      },
    ]);
  };
  const reportUser = async () => {
    if (reportState) {
      Toast.show("既に報告済みです！", {
        position: 50,
      });
      return;
    }
    Alert.alert(
      "報告",
      `${user.name}を悪意のあるユーザーとして報告しますか？`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            const url = "https://slack.com/api/chat.postMessage";
            const token = slackToken;
            const result = await axios.request({
              headers: {
                authorization: `Bearer ${token}`,
              },
              url,
              method: "POST",
              data: {
                channel: "#report",
                text: `id:${userInfo.id}\n name: ${userInfo.name}\nreport from: ${userData.id} ${userData.name}`,
              },
            });
            console.log(result.data);
            setReportState(true);
            Toast.show("Thank you!", {
              position: 50,
            });
          },
        },
      ]
    );
  };

  if (!userData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (blockState.block || blockState.blocked) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Modal
        isVisible={isShowCalendar}
        onBackdropPress={toggleCalendar}
        animationIn="zoomInUp"
        animationOut="zoomOut"
      >
        <DoneCalendar userData={userInfo}/>
      </Modal>
        <OtherProfileInfo
          userData={userInfo}
          followData={followData}
          imageSrc={imageSrc}
          isFollowed={isFollowed}
          follow={follow}
          unfollow={unfollow}
          doneCounts={doneCounts}
          isCurrentUser={isCurrentUser}
          blockUser={blockUser}
          unblockUser={unblockUser}
          blockState={blockState}
          reportUser={reportUser}
          toggleCalendar={toggleCalendar} 
        />
        <View style={{ flex: 1 }}>
          <View
            style={{
              padding: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon
              name="exclamation-triangle"
              type="font-awesome"
              color="#1F2937"
              style={{ marginRight: 10 }}
            />
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 20,
                color: "#1F2937",
              }}
            >
              {blockState.block
                ? "ブロック中のユーザーです"
                : "ブロックされています"}
            </Text>
          </View>

          {blockState.block && (
            <Button
              title="ブロックを解除する"
              type="clear"
              onPress={() => unblockUser()}
            />
          )}
        </View>

        <KeyboardAvoidingView>
          <Icon
            name="arrow-left"
            type="font-awesome"
            color="#3B82F6"
            size={24}
            reverse
            raised
            containerStyle={{ position: "absolute", bottom: "7%", left: "3%" }}
            onPress={() => navigation.goBack()}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Overlay isVisible={isModalVisible} fullScreen>
        <EditProfile
          toggleModal={toggleModal}
          userData={userData}
          imageSrc={imageSrc}
        />
      </Overlay>
      <Modal
        isVisible={isShowCalendar}
        onBackdropPress={toggleCalendar}
        animationIn="zoomInUp"
        animationOut="zoomOut"
      >
        <DoneCalendar userData={userInfo}/>
      </Modal>
      <FlatList
        ListHeaderComponent={
          isCurrentUser ? (
            <ProfileInfo
              userData={userInfo}
              followData={followData}
              toggleModal={toggleModal}
              imageSrc={imageSrc}
              doneCounts={doneCounts}
            />
          ) : (
            <OtherProfileInfo
              userData={userInfo}
              followData={followData}
              imageSrc={imageSrc}
              isFollowed={isFollowed}
              follow={follow}
              unfollow={unfollow}
              doneCounts={doneCounts}
              isCurrentUser={isCurrentUser}
              blockUser={blockUser}
              unblockUser={unblockUser}
              blockState={blockState}
              reportUser={reportUser}
              toggleCalendar={toggleCalendar} 
            />
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshState}
            onRefresh={() => refreshData()}
          />
        }
        showsVerticalScrollIndicator={false}
        data={userPostsData}
        keyExtractor={(item) => item?.id?.toString()}
        renderItem={({ item }) => {
          return <DonePost post={item} userData={userData} image={imageSrc} />;
        }}
        onEndReached={fetchData}
        onEndReachedThreshold={0.5}
      />
      <KeyboardAvoidingView>
        <Icon
          name="arrow-left"
          type="font-awesome"
          color="#3B82F6"
          size={24}
          reverse
          raised
          containerStyle={{ position: "absolute", bottom: "7%", left: "3%" }}
          onPress={() => navigation.goBack()}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default UserPage;
