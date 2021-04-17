import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View ,TouchableOpacity} from 'react-native';
import { ListItem, Avatar, Icon } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native';
import axios from '../../../constants/axios';

type Props = {
  post,
  imageSrc,
  userData
}

const UserPost: React.FC<Props> = (props) => {
  const {post, imageSrc, userData} = props;
  const [likeState, setLikeState] = useState(false)
  const [likeNum, setLikeNum] = useState(0)
  const navigation = useNavigation()
  // console.log(post)
  useEffect(() => {
    isLike()
  },[]);

  const parseDate = (val) => {
    return val.toString().replace(/([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2})([\w|:|.|+]*)/, "$4:$5")
  }
  const isLike = () => {
    setLikeNum(post.likes.length)
    post.likes.map(p => {
      if(p.user_id === userData.id){
        setLikeState(true)
        return
      }
    })
  }
  const like = async () => {
    axios.post('/api/likes/', {
      like: {
        user_id: userData.id,
        done_post_id: post.id
      }
    })
    .then(() => {
      setLikeNum(likeNum+1)
      setLikeState(true)
    })
  }

  const unlike = async () => {
    axios.delete('/api/likes/', {
      params: {
        user_id: userData.id,
        done_post_id: post.id
      }
    })
    .then(() => {
      setLikeNum(likeNum-1)
      setLikeState(false)
    })
  }


  return (
    <ListItem bottomDivider onPress={() => navigation.navigate('Detail', 
    {
      post: post,
      imageSrc: imageSrc,
      userData: userData,
      likeState: likeState,
      likeNum: likeNum
    })}>
    <ListItem.Content>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {imageSrc && <Avatar 
              rounded
              source={{
                uri: imageSrc
              }}
              containerStyle={{backgroundColor: 'gray', marginRight: 10}}
              onPress={() => navigation.navigate('UserPage', 
              {
                user: post.user
              })}
            />}
            {!imageSrc && <Avatar 
              rounded
              title={post.user.name[0]} 
              containerStyle={{backgroundColor: 'gray', marginRight: 10}}
              onPress={() => navigation.navigate('UserPage', 
              {
                user: post.user
              })}
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
          {!likeState && <Icon
          name='heart'
          type="font-awesome-5"
          size={20}
          color='#F87171' 
          onPress={() => like()}
          />}
          {likeState && <Icon
          name='heart'
          type="font-awesome-5"
          size={20}
          color='#F87171' 
          solid
          onPress={() => unlike()}
          />}
          <Text style={{color: '#F87171', marginHorizontal: 7}}>{likeNum}</Text>
          <Text style={{fontSize: 10, color: 'gray', width: '70%', textAlign: 'right'}}>{parseDate(post.created_at)}</Text>
        </View>
      </View>
    </ListItem.Content>
  </ListItem>
  )
}

export default UserPost
