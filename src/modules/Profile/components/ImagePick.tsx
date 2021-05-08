import React, { useState, useEffect } from "react";
import { Button, Image, View, Platform } from "react-native";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import axios from "../../../constants/axios";
import firebase from "firebase";
import Toast from "react-native-root-toast";

export default function ImagePick(props) {
  const [image, setImage] = useState(null);
  const { userData, toggleModal } = props;

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      changeAvatar(result);
    }
  };

  const changeAvatar = async (result) => {
    console.log(image);
    //撮影された（ローカルの）写真を取得
    const localUri = await fetch(result.uri);
    //blobを取得
    const localBlob = await localUri.blob();

    //  ストレージ全体の参照を取得する
    var storageRef = firebase.storage().ref();
    //  保存先の参照：そのchildの参照を作成・取得するフォルダ名/ファイル名.拡張子
    var mountainsRef = storageRef.child(`images/${userData.uid}.jpg`);

    // アップロード実施
    //  blobのデータを、保存先の参照にputする
    mountainsRef.put(localBlob).then(function (snapshot) {
      console.log("FIRE STORE SUCCESS");
    });
    toggleModal();
    Toast.show("プロフィール画像を変更しました", {
      position: 50,
    });
  };

  const deleteAvatar = async () => {
    var storageRef = firebase.storage().ref();
    // Create a reference to the file to delete
    var desertRef = storageRef.child(`images/${userData.uid}.jpg`);

    // Delete the file
    desertRef
      .delete()
      .then(function () {
        // File deleted successfully
        console.log("File deleted successfully");
      })
      .catch(function (error) {
        // Uh-oh, an error occurred!
        console.log("Uh-oh, an error occurred!");
      });
    toggleModal();
  };

  return (
    <View>
      <Button title="削除" onPress={deleteAvatar} />
      <Button title="Pick an image from camera roll" onPress={pickImage} />
    </View>
  );
}
