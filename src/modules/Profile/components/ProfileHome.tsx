import React, { useState, useEffect } from "react";
import {
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
import ProfileInfo from "./ProfileInfo";
import EditProfile from "./EditProfile";
import { Divider, Overlay } from "react-native-elements";
import firebase from "firebase";
import { StatusBar } from "expo-status-bar";
import DonePost from "../../common/DonePost";
import Modal from "react-native-modal";
import DoneCalendar from '../../common/DoneCalendar'

function ProfileHome() {
  // const {state} = useContext(SiteContext);
  const navigation = useNavigation();
  const [userData, setData] = useState();
  const [refreshState, setRefreshData] = useState(false);
  const [userPostsData, setUserPostData] = useState();
  const [pageData, setPageData] = useState(2);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isShowCalendar, setIsShowCalendar] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [followData, setFollowData] = useState({ following: 0, follower: 0 });
  const [doneCounts, setDoneCounts] = useState(0);
  const [blockUsers, setBlockUsers] = useState([]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleCalendar = () => {
    setIsShowCalendar(!isShowCalendar);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const getAvatar = (userData) => {
    return new Promise((resolve) => {
      var storage = firebase.storage();
      var storageRef = storage.ref();
      var spaceRef = storageRef.child(`images/${userData.uid}_200x200.jpg`);
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
      if (data.uid !== undefined) {
        setData(data);
        console.log(data);
      }
      console.log("----------------------");
      // console.log(data)
      axios.get("/api/users/following/" + data.uid).then((res) => {
        setFollowData(res.data);
        setDoneCounts(res.data.done_counts);
        setBlockUsers(res.data.block_users);
      });
      axios
        .get("/api/done_posts", {
          params: {
            page: 1,
            uid: data.uid,
          },
        })
        .then((res) => {
          setPageData(2);
          // console.log("----------------------")
          // let postsData = res.data.done_posts.reverse()
          // setUserPostData(postsData)
          console.log(res.data);
          setUserPostData(res.data);
          setRefreshData(false);
        })
        .catch((e) => console.log(e));
    });
  };

  const fetchData = () => {
    axios
      .get("/api/done_posts", {
        params: {
          page: pageData,
          uid: userData.uid,
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
  getSource(userData);

  if (!userData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Modal
        isVisible={isShowCalendar}
        onBackdropPress={toggleCalendar}
        animationIn="zoomInUp"
        animationOut="zoomOut"
      >
        <DoneCalendar userData={userData}/>
      </Modal>
      <Overlay isVisible={isModalVisible} fullScreen>
        <EditProfile
          toggleModal={toggleModal}
          userData={userData}
          imageSrc={imageSrc}
          blockUsers={blockUsers}
        />
      </Overlay>
      <FlatList
        ListHeaderComponent={
          <ProfileInfo
            userData={userData}
            followData={followData}
            toggleModal={toggleModal}
            imageSrc={imageSrc}
            doneCounts={doneCounts}
            toggleCalendar={toggleCalendar}
          />
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
      {/* <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshState}
              onRefresh={() => refreshData()}
            />
          }
        >
        <ProfileInfo userData={userData} followData={followData} toggleModal={toggleModal} imageSrc={imageSrc} doneCounts={doneCounts}/>
        <Divider style={{ marginTop: 10}} />
          <UserPostList posts={userPostsData} fetchData={fetchData} imageSrc={imageSrc} userData={userData}/>
        </ScrollView> */}
    </SafeAreaView>
  );
}

export default ProfileHome;
