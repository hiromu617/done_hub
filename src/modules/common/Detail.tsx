import React, { useEffect, useState, useRef } from "react";
import {
  Alert,
  FlatList,
  Text,
  View,
  ScrollView,
  RefreshControl,
  KeyboardAvoidingView,
  Pressable,
} from "react-native";
import { ListItem, Avatar, Icon, Overlay, Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import axios from "../../constants/axios";
import Reply from "./Reply";
import ReplyForm from "./ReplyForm";
import Modal from "react-native-modal";
import Toast from "react-native-root-toast";
import { slackToken } from "../../../config";
import { sendPushNotification } from "../../constants/pushNotificationFunc";
import { getAvatar } from "./CommonUtil";
import LottieView from "lottie-react-native";

const Detail: React.FC = ({ route }) => {
  const navigation = useNavigation();
  const {
    post,
    initialImageSrc,
    currentUser,
    initialLikeState,
    initialLikeNum,
  } = route.params;
  const [likeState, setLikeState] = useState(initialLikeState);
  const [likeNum, setLikeNum] = useState(initialLikeNum);
  const [refreshState, setRefreshData] = useState(false);
  const [postData, setPostData] = useState(post);
  const [replyData, setReplyData] = useState(post.replys); //投稿への返信のデータ
  const [imageSrc, setImageSrc] = useState(initialImageSrc);
  const [autoFocusState, setAutoFocusState] = useState(false); //フォームにフォーカスするかどうか
  const [deleteModalState, setDeleteModalState] = useState(false); //削除のモーダルを表示するかどうか
  const [likedUsers, setLikedUsers] = useState(
    postData.likes.map((l) => l.user)
  ); //likeしているユーザーs
  const [reportState, setReportState] = useState(false); //currentuserが報告したかどうか
  const [likeLoading, setLikeLoading] = useState(false);
  const likeAnimation = useRef(null);

  useEffect(() => {
    // if (initialLikeState === undefined) {
    isLike();
    // }
    if (initialImageSrc === undefined) {
      getSource();
    }
  }, []);

  const deletePost = async () => {
    Alert.alert("投稿の削除", "本当に削除してもよろしいですか？", [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => setDeleteModalState(false),
      },
      {
        text: "OK",
        onPress: () => {
          axios
            .delete("/api/done_posts/" + postData.id)
            .then((res) => {
              setDeleteModalState(false);
              navigation.goBack();
              Toast.show("投稿を削除しました", {
                position: 50,
              });
            })
            .catch((e) => console.log(e));
        },
      },
    ]);
  };

  const getSource = () => {
    getAvatar(post.user.uid).then((res) => {
      setImageSrc(res);
    });
  };

  const refreshData = () => {
    setRefreshData(true);
    axios.get("/api/done_posts/" + post.id).then((res) => {
      setPostData(res.data);
      setReplyData(res.data.replys);
      setRefreshData(false);
    });
  };

  // インディケータ無しで更新
  const refreshWithOutIndicator = () => {
    axios.get("/api/done_posts/" + post.id).then((res) => {
      setPostData(res.data);
      setReplyData(res.data.replys);
    });
  };

  // 詳しい日付を取得
  const parseDetailDate = (val) => {
    return val
      .toString()
      .replace(
        /([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2})([\w|:|.|+]*)/,
        "$2/$3 $4:$5"
      );
  };

  // currentUserがlikeしているかどうか
  const isLike = async () => {
    setLikeNum(post.likes.length);
    setLikeState(false);
    await post.likes.map((p) => {
      if (p.user_id === currentUser.id) {
        setLikeState(true);
        likeAnimation.current.play(66, 66);
      }
    });
    if (likeState) {
      likeAnimation.current.play(66, 66);
    } else {
      likeAnimation.current.play(19, 19);
    }
  };

  const like = async () => {
    likeAnimation.current.play(29, 50);
    setLikeState(true);
    setLikeNum(likeNum + 1);
    await axios
      .post("/api/likes/", {
        like: {
          user_id: currentUser.id,
          done_post_id: postData.id,
        },
      })
      .then((res) => {
        if (res.data.length !== likeNum) {
          setLikeNum(res.data.length);
        }
      });
    if (post.user.id === currentUser.id) return;
    sendPushNotification(
      post.user.expo_push_token,
      "Done Hub",
      `${currentUser.name}さんが投稿にいいねしました`
    );
  };

  const unlike = async () => {
    likeAnimation.current.play(0, 19);
    setLikeNum(likeNum - 1);
    setLikeState(false);
    await axios
      .delete("/api/likes/", {
        params: {
          user_id: currentUser.id,
          done_post_id: postData.id,
        },
      })
      .then((res) => {
        if (res.data.length !== likeNum) {
          setLikeNum(res.data.length);
        }
      });
  };

  const reportPost = async () => {
    if (reportState) {
      Toast.show("既に報告済みです！", {
        position: 50,
      });
      return;
    }
    Alert.alert("報告", "悪意のある投稿として報告しますか？", [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => setDeleteModalState(false),
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
              text: `id:${post.id}\n name: ${post.user.name}\n comment: ${post.comment}\n title: ${post.title}\n tasks: ${post.tasks}\nreport from: ${currentUser.id} ${currentUser.name}`,
            },
          });
          // console.log(result.data);
          setDeleteModalState(false);
          setReportState(true);
          Toast.show("Thank you!", {
            position: 50,
          });
        },
      },
    ]);
  };
  return (
    <View style={{ height: "100%" }}>
      <Modal
        isVisible={deleteModalState}
        onBackdropPress={() => setDeleteModalState(false)}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        backdropOpacity={0.3}
        style={{
          backgroundColor: "white",
          position: "absolute",
          top: "10%",
          right: 30,
          width: 100,
          height: 60,
          borderRadius: 10,
        }}
      >
        <View style={{ backgroundColor: "white" }}>
          {currentUser.id == postData.user.id ? (
            // 投稿がcurrentUserの時,削除ボタンを表示、そうでない時、報告ボタンを表示
            <Button
              icon={
                <Icon
                  name="trash"
                  type="font-awesome"
                  color="#EF4444"
                  size={20}
                />
              }
              title="削除"
              type="clear"
              titleStyle={{ color: "#EF4444", marginLeft: 10 }}
              onPress={() => deletePost()}
            />
          ) : (
            <Button
              icon={
                <Icon name="flag" type="font-awesome" color="black" size={20} />
              }
              title="報告"
              type="clear"
              titleStyle={{ color: "black", marginLeft: 10 }}
              onPress={() => reportPost()}
            />
          )}
        </View>
      </Modal>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshState}
            onRefresh={() => refreshData()}
          />
        }
        style={{ flex: 1 }}
      >
        <View>
          <ListItem bottomDivider containerStyle={{ paddingBottom: 0 }}>
            <ListItem.Content>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {imageSrc && (
                    <Avatar
                      rounded
                      size="medium"
                      source={{
                        uri: imageSrc,
                      }}
                      containerStyle={{
                        backgroundColor: "gray",
                        marginRight: 10,
                      }}
                      onPress={() => {
                        if (currentUser.id === post.user.id) {
                          navigation.navigate("Profile");
                        } else {
                          navigation.push("UserPage", {
                            user: post.user,
                          });
                        }
                      }}
                    />
                  )}
                  {!imageSrc && (
                    <Avatar
                      rounded
                      size="medium"
                      title={post.user.name[0]}
                      containerStyle={{
                        backgroundColor: "gray",
                        marginRight: 10,
                      }}
                      onPress={() => {
                        if (currentUser.id === post.user.id) {
                          navigation.navigate("Profile");
                        } else {
                          navigation.push("UserPage", {
                            user: post.user,
                          });
                        }
                      }}
                    />
                  )}
                  <ListItem.Title
                    style={{ paddingBottom: 5, fontWeight: "bold" }}
                  >
                    {post.user.name}
                  </ListItem.Title>
                </View>

                <View>
                  <Icon
                    name="ellipsis-v"
                    type="font-awesome"
                    color="gray"
                    style={{ padding: 10 }}
                    onPress={() => setDeleteModalState(true)}
                  />
                </View>
              </View>
              <View style={{ width: "100%", paddingTop: 10 }}>
                {postData.comment.length > 0 && (
                  <Text
                    style={{
                      backgroundColor: "#EFF6FF",
                      width: "100%",
                      padding: 8,
                      borderRadius: 10,
                      fontSize: 14,
                    }}
                  >
                    {post.comment}
                  </Text>
                )}
                {postData.title && (
                  <ListItem.Title
                    style={{
                      paddingVertical: 20,
                      fontWeight: "bold",
                      fontSize: 18,
                    }}
                  >
                    「{post.title}」 DONE！✨
                  </ListItem.Title>
                )}
                {!postData.title && (
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    style={{
                      padding: 3,
                      margin: 20,
                      backgroundColor: "#F4F4F5",
                    }}
                    data={JSON.parse(postData.tasks[0])}
                    renderItem={({ item }) => {
                      const color: string = item.checked
                        ? "#1D4ED8"
                        : "#BFDBFE";
                      return (
                        <ListItem bottomDivider>
                          <Icon name="check" color={color} />
                          <ListItem.Content>
                            <Text>{item.name}</Text>
                          </ListItem.Content>
                          {item.expired && (
                            <Text style={{ fontSize: 11 }}>
                              ~{new Date(item.expired).getMonth() + 1}/
                              {new Date(item.expired).getDate()}
                            </Text>
                          )}
                        </ListItem>
                      );
                    }}
                  />
                )}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "25%",
                    }}
                  >
                    <Icon
                      name="comment"
                      type="font-awesome-5"
                      size={20}
                      color="gray"
                      containerStyle={{ padding: 10 }}
                      onPress={() => setAutoFocusState(true)}
                    />
                    <Text
                      style={{
                        color: "gray",
                        marginLeft: 7,
                        fontSize: 14,
                      }}
                    >
                      {replyData.length >= 1 ? replyData.length : " "}
                    </Text>
                    <Pressable
                      hitSlop={30}
                      onPress={() => {
                        // アニメーションが終わるまで押せないようにする
                        if (likeLoading) {
                          return;
                        } else {
                          setLikeLoading(true);
                          if (likeState) unlike();
                          else like();
                        }
                      }}
                    >
                      <LottieView
                        style={{
                          width: 55,
                          height: 55,
                          backgroundColor: "#fff",
                        }}
                        source={require("../../../assets/44921-like-animation.json")}
                        ref={likeAnimation}
                        autoPlay={false}
                        loop={false}
                        onAnimationFinish={() => setLikeLoading(false)}
                      />
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        navigation.push("LikedUsers", {
                          following: likedUsers,
                        });
                      }}
                      hitSlop={20}
                    >
                      <Text
                        style={{
                          color: "gray",
                          marginHorizontal: 0,
                          fontSize: 12,
                        }}
                      >
                        {likeNum} 件のいいね
                      </Text>
                    </Pressable>
                  </View>
                  <Text
                    style={{
                      fontSize: 10,
                      color: "gray",
                      width: "75%",
                      textAlign: "right",
                    }}
                  >
                    {parseDetailDate(post.created_at)}
                  </Text>
                </View>
              </View>
            </ListItem.Content>
          </ListItem>
          {replyData && (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={replyData}
              keyExtractor={(item) => item?.id?.toString()}
              renderItem={({ item }) => {
                return (
                  <Reply
                    reply={item}
                    currentUser={currentUser}
                    refreshData={refreshWithOutIndicator}
                  />
                );
              }}
            />
          )}
        </View>
      </ScrollView>
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
      <ReplyForm
        post={postData}
        currentUser={currentUser}
        refreshData={refreshWithOutIndicator}
        autoFocus={autoFocusState}
        setAutoFocusState={setAutoFocusState}
      />
    </View>
  );
};

export default Detail;
