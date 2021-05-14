import firebase from "firebase";

// firebase Storageから画像を取得
export const getAvatar = (uid) => {
  return new Promise((resolve) => {
    var storage = firebase.storage();
    var storageRef = storage.ref();
    var spaceRef = storageRef.child(`images/${uid}_200x200.jpg`);
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