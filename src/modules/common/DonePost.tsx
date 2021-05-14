import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { ListItem, Avatar, Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import firebase from "firebase";
import axios from "../../constants/axios";
import { FlatList } from "react-native-gesture-handler";
import { sendPushNotification } from "../../constants/pushNotificationFunc";
import { getAvatar } from "./CommonUtil";

type Props = {
  post;
  currentUser;
  image;
};

const DonePost: React.FC<Props> = (props) => {
  const { post, currentUser, image } = props;
  const [imageSrc, setImageSrc] = useState(image);
  const [likeState, setLikeState] = useState(false); //currentUserがlikeしているかどうか
  const [likeNum, setLikeNum] = useState(0); //投稿へのlikeの数
  const navigation = useNavigation();

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

  // 日付のフォーマットを変更
  const parseDate = (val) => {
    return val
      .toString()
      .replace(
        /([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2})([\w|:|.|+]*)/,
        "$4:$5"
      );
  };

  // CurrentUserがlikeしているかチェック
  const isLike = () => {
    setLikeNum(post.likes.length);
    setLikeState(false);
    post.likes.map((p) => {
      if (p.user_id === currentUser.id) {
        setLikeState(true);
        return;
      }
    });
  };

  const like = async () => {
    setLikeState(true);
    setLikeNum(likeNum + 1);
    axios
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
    sendPushNotification(
      post.user.expo_push_token,
      "Done Hub",
      `${currentUser.name}さんが投稿にいいねしました`
    );
  };

  const unlike = async () => {
    setLikeState(false);
    setLikeNum(likeNum - 1);
    axios
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
            <ListItem.Title style={{ paddingVertical: 15, fontWeight: "bold" }}>
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
            <Icon name="comment" type="font-awesome-5" size={20} color="gray" />
            <Text style={{ color: "gray", marginHorizontal: 0 }}>
              {post.replys.length}
            </Text>
            {!likeState && (
              <Icon
                name="heart"
                type="font-awesome-5"
                size={20}
                color="#F87171"
                onPress={() => like()}
              />
            )}
            {likeState && (
              <Icon
                name="heart"
                type="font-awesome-5"
                size={20}
                color="#F87171"
                solid
                onPress={() => unlike()}
              />
            )}
            <Text style={{ color: "#F87171", marginHorizontal: 0 }}>
              {likeNum}
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: "gray",
                width: "70%",
                textAlign: "right",
              }}
            >
              {parseDate(post.created_at)}
            </Text>
          </View>
        </View>
      </ListItem.Content>
    </ListItem>
  );
};

export default DonePost;
