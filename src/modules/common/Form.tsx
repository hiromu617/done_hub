import React, { useRef, useContext, useState, useEffect } from "react";
import {
  View,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  Text,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { AntDesign } from "@expo/vector-icons";
import { Input, Button, Icon } from "react-native-elements";
import axios from "../../constants/axios";
import Toast from "react-native-root-toast";
import { sendPushNotification } from "../../constants/pushNotificationFunc";

type Props = {
  post;
  userData;
  refreshData;
  autoFocus;
  setAutoFocusState;
};

const ReplyModal: React.FC<Props> = (props) => {
  const { post, userData, refreshData, autoFocus, setAutoFocusState } = props;
  const { control, handleSubmit, errors, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const commentRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (autoFocus && commentRef.current) {
      commentRef.current.focus();
      setAutoFocusState(false);
    }
  }, [autoFocus]);

  const onSubmit = (data) => {
    if (loading === true) return;
    setLoading(true);
    Keyboard.dismiss();
    axios
      .post("/api/replys", {
        reply: {
          user_id: userData.id,
          done_post_id: post.id,
          content: data.content,
        },
      })
      .then(() => {
        setLoading(false);
        refreshData();
        setValue("content", "");
        Toast.show("返信しました", {
          position: 50,
        });
      });
    if (post.user.id !== userData.id) {
      sendPushNotification(
        post.user.expo_push_token,
        "Done Hub",
        `${userData.name}さんが投稿に返信しました`
      );
    }

    let users = post.replys.map((r) => {
      return r.user;
    })

    let hash = {};
    for (let i = 0; i < users.length; i++) {
      if (hash[users[i].id] === post.user.id) continue;

      if (hash[users[i].id] === undefined)
        hash[users[i].id] = users[i];
    }
    let keys = Object.keys(hash)
    let values = Object.values(hash)
    for(let i = 0; i < keys[i].length; i++){
      if(keys[i] == post.user.id || keys[i] == userData.id) continue
      else {
        sendPushNotification(
        values[i].expo_push_token,
        "Done Hub",
        `${userData.name}さんが投稿に返信しました`
      );
      } 
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ backgroundColor: "white", padding: 10 }}
      keyboardVerticalOffset={80}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Controller
            control={control}
            render={({ onChange, value }) => (
              <TextInput
                ref={commentRef}
                multiline={true}
                placeholder="返信する"
                onChangeText={(value) => onChange(value)}
                value={value}
                style={{
                  width: "83%",
                  backgroundColor: "#EFF6FF",
                  borderRadius: 10,
                  padding: 10,
                }}
              />
            )}
            name="content"
            defaultValue=""
            rules={{
              maxLength: 140,
              required: true,
            }}
          />
          {errors.name && errors.name.type === "required" && (
            <Text style={styles.errorText}>何か入力してください</Text>
          )}
          {errors.name && errors.name.type === "maxLength" && (
            <Text style={styles.errorText}>
              140文字以内で入力してください。
            </Text>
          )}
          <Button
            title="送信"
            // type='outline'
            buttonStyle={{ backgroundColor: "#3B82F6" }}
            titleStyle={{ fontSize: 14 }}
            loading={loading}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ReplyModal;

const styles = StyleSheet.create({
  input: {
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "grey",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    width: "100%",
    fontSize: 18,
    padding: "4%",
    margin: "4%",
  },
  errorText: {
    color: "red",
  },
  btnWrap: {
    position: "absolute",
    top: "5%",
    right: "5%",
  },
  btn: {},
});
