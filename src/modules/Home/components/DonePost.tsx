import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View ,TouchableOpacity} from 'react-native';
import { ListItem, Avatar, Icon } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase'

type Props = {
  post,
}

const DonePost: React.FC<Props> = (props) => {
  const {post} = props;
  const [imageSrc, setImageSrc] = useState(null)
  const navigation = useNavigation()
  console.log(post)

  useEffect(() => {
    getSource(post)
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
    return val.toString().replace(/([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2})([\w|:|.|+]*)/, "$4:$5")
  }

  return (
    <ListItem bottomDivider onPress={() => navigation.navigate('Detail', 
    {
      post: post,
      imageSrc: imageSrc
    })}>
    <ListItem.Content>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {imageSrc && <Avatar 
              rounded
              source={{
                uri: imageSrc
              }}
              containerStyle={{backgroundColor: 'gray', marginRight: 10}}
            />}
            {!imageSrc && <Avatar 
              rounded
              title={post.user.name[0]} 
              containerStyle={{backgroundColor: 'gray', marginRight: 10}}
            />}
        <ListItem.Title  style={{paddingBottom: 5,fontWeight: 'bold'}}>{post.user.name}</ListItem.Title>
      </View>
      <View  style={{paddingLeft: 40, width: '100%'}}>
        {post.comment.length > 0 && <Text style={{backgroundColor: '#EFF6FF', width: '100%', padding: 8, borderRadius: 10}}>{post.comment}</Text>}
        <ListItem.Title  style={{paddingVertical: 15,fontWeight: 'bold'}}>「{post.title}」 DONE！✨</ListItem.Title>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Icon
          name='comment'
          type="font-awesome-5"
          size={20}
          color='gray' />
          <Text style={{color: 'gray', marginHorizontal: 7}}>0</Text>
          <Icon
          name='heart'
          type="font-awesome-5"
          size={20}
          color='#F87171' />
          <Text style={{color: '#F87171', marginHorizontal: 7}}>5</Text>
          <Text style={{fontSize: 10, color: 'gray', width: '70%', textAlign: 'right'}}>{parseDate(post.created_at)}</Text>
        </View>
      </View>
    </ListItem.Content>
  </ListItem>
  )
}

export default DonePost
