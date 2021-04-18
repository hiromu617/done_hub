import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View ,TouchableOpacity, FlatList} from 'react-native';
import { ListItem, Avatar, Icon } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import axios from '../../constants/axios';
import firebase from 'firebase'

type Props = {
  reply
}

const Reply: React.FC<Props> = (props) => {
  const { reply, toggleModal } = props
  const [imageSrc, setImageSrc] = useState(null)
  const navigation = useNavigation()

  useEffect(() => {
    getSource(reply)
  },[]);

  const getAvatar =  (post) => {
    return new Promise((resolve) => {
      var storage = firebase.storage();
      var storageRef = storage.ref();
      var spaceRef = storageRef.child(`images/${post.user.uid}.jpg`);
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
  const getSource = (userData) => {
    getAvatar(userData)
    .then(res => {
      setImageSrc(res)
    })
  }

  const parseDate = (val) => {
    return val.toString().replace(/([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2})([\w|:|.|+]*)/, "$2/$3 $4:$5")
  }
  return (
    <ListItem 
      bottomDivider
      onPress={() => toggleModal()}
    >
      <ListItem.Content>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {imageSrc && <Avatar 
          rounded
          size='small'
          source={{
          uri: imageSrc
        }}
        containerStyle={{backgroundColor: 'gray', marginRight: 10}}
        onPress={() => navigation.navigate('UserPage', 
        {
          user: reply.user
        })}         
        />}
        {!imageSrc && <Avatar 
          rounded
          size='small'
          title={reply.user.name[0]} 
          containerStyle={{backgroundColor: 'gray', marginRight: 10}}
          onPress={() => navigation.navigate('UserPage', 
          {
            user: reply.user
          })}
        />}
        <ListItem.Title  style={{paddingBottom: 5,fontWeight: 'bold', fontSize: 16}}>{reply.user.name}</ListItem.Title>
        </View>
        <View style={{width: '100%', paddingTop: 10, paddingLeft: '12%'}}>
          <ListItem.Title>{reply.content}</ListItem.Title>
          <Text style={{fontSize: 10, color: 'gray', width: '100%', textAlign: 'right'}}>{parseDate(reply.created_at)}</Text>
        </View>
      </ListItem.Content>
    </ListItem>
  )
 
}

export default Reply
