import React, { useEffect, useState, useCallback, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { ListItem, Avatar, Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import firebase from "firebase";
import axios from "../../constants/axios";
import { FlatList } from "react-native-gesture-handler";
import { sendPushNotification } from "../../constants/pushNotificationFunc";
import { getAvatar } from "./CommonUtil";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import LottieView from "lottie-react-native";

type Props = {
  post;
  currentUser;
  image;
};

const DonePost: React.FC<Props> = (props) => {
  const { post, currentUser, image } = props;
  const [imageSrc, setImageSrc] = useState(image);
  const [likeState, setLikeState] = useState(false); //currentUserがlikeしているかどうか
  const [likeLoading, setLikeLoading] = useState(false); 
  const [likeNum, setLikeNum] = useState(0); //投稿へのlikeの数
  const navigation = useNavigation();
  const likeAnimation = useRef(null);

  useEffect(() => {
    // imageがnullの時imageを取得
    if (!image) {
      getSource();
    }
  }, []);

  useEffect(() => {
    isLike();
  }, [post.likes]);

  const getSource = useCallback(async () => {
    getAvatar(post.user.uid).then((res) => {
      setImageSrc(res);
    });
  }, []);

  // CurrentUserがlikeしているかチェック,それに合わせてアニメーションを変更
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
          done_post_id: post.id,
        },
      })
      .then((res) => {
        if (res.data.length !== likeNum) {
          setLikeNum(res.data.length);
        }
      });
    if (post.user.id === currentUser.id) return;
    else {
      sendPushNotification(
        post.user.expo_push_token,
        "Done Hub",
        `${currentUser.name}さんが投稿にいいねしました`
      );
    }
  };

  const unlike = async () => {
    likeAnimation.current.play(0, 19);
    setLikeState(false);
    setLikeNum(likeNum - 1);
    await axios
      .delete("/api/likes/", {
        params: {
          user_id: currentUser.id,
          done_post_id: post.id,
        },
      })
      .then((res) => {
        if (res.data.length !== likeNum) {
          setLikeNum(res.data.length);
        }
      });
  };

  return (
    <ListItem
      key={post.id}
      topDivider
      onPress={() =>
        navigation.push("Detail", {
          post: post,
          initialImageSrc: imageSrc,
          currentUser: currentUser,
          initialLikeState: likeState,
          initialLikeNum: likeNum,
        })
      }
      containerStyle={{ paddingBottom: 0 }}
    >
      <ListItem.Content>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {imageSrc && (
            <Avatar
              rounded
              source={{
                uri: imageSrc,
              }}
              containerStyle={{ backgroundColor: "gray", marginRight: 10 }}
              onPress={() => {
                // 遷移先がCurrentUserならProfileのTabに遷移
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
              title={post.user.name[0]}
              containerStyle={{ backgroundColor: "gray", marginRight: 10 }}
              onPress={() => {
                // 遷移先がCurrentUserならProfileのTabに遷移
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
          <ListItem.Title style={{ paddingBottom: 5, fontWeight: "bold" }}>
            {post.user.name}
          </ListItem.Title>
        </View>
        <View style={{ paddingLeft: 40, width: "100%" }}>
          {post.comment.length > 0 && (
            <Text
              style={{
                backgroundColor: "#EFF6FF",
                width: "100%",
                padding: 8,
                borderRadius: 10,
              }}
            >
              {post.comment}
            </Text>
          )}
          {post.title && (
            <ListItem.Title style={{ paddingTop: 15, fontWeight: "bold" }}>
              「{post.title}」 DONE！✨
            </ListItem.Title>
          )}
          {!post.title && (
            <FlatList
              showsVerticalScrollIndicator={false}
              style={{ padding: 3, margin: 20, backgroundColor: "#F4F4F5" }}
              data={JSON.parse(post.tasks[0])}
              renderItem={({ item }) => {
                const color: string = item.checked ? "#1D4ED8" : "#BFDBFE";
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
              />
              <Text style={{ color: "gray", marginLeft: 15 }}>
                {post.replys.length}
              </Text>
              <TouchableOpacity
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
                  style={{ width: 60, height: 60, backgroundColor: "#fff" }}
                  source={require("../../../assets/44921-like-animation.json")}
                  ref={likeAnimation}
                  autoPlay={false}
                  loop={false}
                  onAnimationFinish={() => setLikeLoading(false)}
                />
              </TouchableOpacity>
              <Text
                style={{
                  color: likeState ? "#F87171" : "gray",
                  marginHorizontal: 0,
                }}
              >
                {likeNum}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 10,
                color: "gray",
                width: "75%",
                textAlign: "right",
              }}
            >
              {formatDistanceToNow(new Date(post.created_at))}
            </Text>
          </View>
        </View>
      </ListItem.Content>
    </ListItem>
  );
};

export default DonePost;
