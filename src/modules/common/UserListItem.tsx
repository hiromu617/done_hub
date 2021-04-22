import React, { useEffect, useState } from 'react';
import { ListItem, Avatar, Icon, Button } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase'

const UserListItem: React.FC = (props) => {
  const [imageSrc, setImageSrc] = useState(null);
  const navigation = useNavigation()
  const { user } = props

  useEffect(() => {
    getSource()
  },[]);

  const getAvatar =  () => {
    return new Promise((resolve) => {
      var storage = firebase.storage();
      var storageRef = storage.ref();
      var spaceRef = storageRef.child(`images/${user.uid}.jpg`);
      spaceRef.getDownloadURL().then(function(url){
        console.log("ファイルURLを取得")
        console.log(url)
        resolve(url);
      }).catch(function(error) {
        // Handle any errors
        console.log("getTokoImage 画像を取得する");
        console.log(error);
      });
    });
  };

  const getSource = () => {
    getAvatar()
    .then(res => {
      setImageSrc(res)
    })
  }
  return (
      <ListItem
        onPress={() => navigation.push('UserPage', 
        {
          user: user
        })}
        bottomDivider
      >
        <Avatar
          title={user.name[0]}
          source={{
            uri: imageSrc
          }}
          rounded
          containerStyle={{backgroundColor: 'gray'}}            
        />
        <ListItem.Content>
          <ListItem.Title>{user.name}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
  )
}

export default UserListItem
