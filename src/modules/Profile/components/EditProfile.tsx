import React, { useReducer, useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Avatar, Text, Button, Icon, Input } from "react-native-elements";
import { useForm, Controller } from "react-hook-form";
import axios from "../../../constants/axios";
import { storeUser } from "../../Todo/Storage";
import User from "../../Profile/objects/User";
import ImagePick from "./ImagePick";
import Toast from "react-native-root-toast";
import { useNavigation } from "@react-navigation/native";
import firebase from "firebase";
import * as Linking from 'expo-linking';

function EditProfile(props) {
  const { toggleModal, currentUser, imageSrc, blockUsers } = props;
  const { control, handleSubmit, errors, setValue } = useForm();
  const navigation = useNavigation();
  const onSubmit = (data) => {
    // console.log(data)
    axios
      .post("/api/users/" + currentUser.uid, {
        user: {
          name: data.name,
          profile: data.profile,
          college: data.college,
          faculty: data.faculty,
          department: data.department,
        },
      })
      .then((res) => {
        console.log("--------------------");
        // console.log(res.data)
        let newUser: User = {
          uid: res.data.uid,
          name: res.data.name,
          profile: res.data.profile,
          college: res.data.college,
          faculty: res.data.faculty,
          department: res.data.department,
          hub_list: res.data.hub_list,
          id: res.data.id,
        };
        console.log("--------------------");
        // console.log(newUser)
        storeUser(newUser);
        toggleModal();
        Toast.show("プロフィールを変更しました", {
          position: 50,
        });
      })
      .catch((e) => console.log(e));
  };
  return (
    <>
      <SafeAreaView style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Button title="閉じる" type="clear" onPress={toggleModal} />
        <Button title="保存" type="clear" onPress={handleSubmit(onSubmit)} />
      </SafeAreaView>
      <ScrollView>
        <Avatar
          rounded
          title={currentUser.name[0]}
          source={{ uri: imageSrc }}
          size="large"
          containerStyle={{ backgroundColor: "gray", margin: 10 }}
        />
        <ImagePick currentUser={currentUser} toggleModal={toggleModal} />
        <Controller
          control={control}
          render={({ onChange, value }) => (
            <Input
              multiline={true}
              label="名前"
              placeholder="名前を追加"
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="name"
          defaultValue={currentUser.name}
          rules={{
            maxLength: 20,
          }}
        />
        {errors.name && errors.name.type === "maxLength" && (
          <Text style={styles.errorText}>
            名前は20文字以内で入力してください。
          </Text>
        )}
        <Controller
          control={control}
          render={({ onChange, value }) => (
            <Input
              multiline={true}
              label="自己紹介"
              placeholder="プロフィールを追加"
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="profile"
          defaultValue={currentUser.profile}
          rules={{
            maxLength: 140,
          }}
        />
        {errors.name && errors.name.type === "maxLength" && (
          <Text style={styles.errorText}>
            タイトルは140文字以内で入力してください。
          </Text>
        )}
        <Controller
          control={control}
          render={({ onChange, value }) => (
            <Input
              label="大学名"
              placeholder="hogehoge大学"
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="college"
          defaultValue={currentUser.college}
          rules={{
            maxLength: 20,
          }}
        />
        {errors.name && errors.name.type === "maxLength" && (
          <Text style={styles.errorText}>
            大学名は20文字以内で入力してください。
          </Text>
        )}
        <Controller
          control={control}
          render={({ onChange, value }) => (
            <Input
              label="学部名"
              placeholder="foo学部"
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="faculty"
          defaultValue={currentUser.faculty}
          rules={{
            maxLength: 20,
          }}
        />
        {errors.name && errors.name.type === "maxLength" && (
          <Text style={styles.errorText}>
            学部名は20文字以内で入力してください。
          </Text>
        )}
        <Controller
          control={control}
          render={({ onChange, value }) => (
            <Input
              label="学科名"
              placeholder="bar学科"
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="department"
          defaultValue={currentUser.department}
          rules={{
            maxLength: 20,
          }}
        />
        {errors.name && errors.name.type === "maxLength" && (
          <Text style={styles.errorText}>
            大学名は20文字以内で入力してください。
          </Text>
        )}
        <Button
          title="ブロックしたユーザー"
          type="clear"
          onPress={() => {
            toggleModal();
            navigation.push("BlockUsers", { follower: blockUsers });
          }}
        />
        <Button
          title="sign out"
          type="clear"
          containerStyle={{ paddingHorizontal: 50 }}
          onPress={() => {
            firebase.auth().signOut();
            navigation.navigate("LoadingScreen");
            Toast.show("sign outしました", {
              position: 50,
            });
          }}
        />
        <TouchableOpacity
        style={{
          width: '100%', 
            paddingHorizontal: 70, 
            marginVertical: 20,
            }}
            onPress={() => Linking.openURL('https://www.buymeacoffee.com/hiromu')}
        >
            <Image
              style={{
                width: '100%',
                height: undefined,
                aspectRatio: 4 / 1,
              }}
              source={{uri: "https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"}}
              />
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

export default EditProfile;

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
