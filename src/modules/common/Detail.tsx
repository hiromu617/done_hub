import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View ,TouchableOpacity, FlatList} from 'react-native';
import { ListItem, Avatar, Icon, Overlay } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import axios from '../../constants/axios';
import Reply from './Reply'
import ReplyForm from './ReplyForm'

const Detail: React.FC = ({route}) => {
  const navigation = useNavigation()
  const { post, imageSrc, userData, initialLikeState, initialLikeNum } = route.params;
  const [likeState, setLikeState] = useState(initialLikeState)
  const [likeNum, setLikeNum] = useState(initialLikeNum)
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // isLike()
  },[]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const parseDate = (val) => {
    return val.toString().replace(/([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2})([\w|:|.|+]*)/, "$2/$3 $4:$5")
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
    <View>
      <ListItem bottomDivider>
    <ListItem.Content>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {imageSrc && <Avatar 
              rounded
              size='medium'
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
              size='medium'
              title={post.user.name[0]} 
              containerStyle={{backgroundColor: 'gray', marginRight: 10}}
              onPress={() => navigation.navigate('UserPage', 
              {
                user: post.user
              })}
            />}
        <ListItem.Title  style={{paddingBottom: 5,fontWeight: 'bold'}}>{post.user.name}</ListItem.Title>
      </View>
      <View  style={{width: '100%', paddingTop: 10}}>
        {post.comment.length > 0 && <Text style={{backgroundColor: '#EFF6FF', width: '100%', padding: 8, borderRadius: 10, fontSize: 16}}>{post.comment}</Text>}
        <ListItem.Title  style={{paddingVertical: 20,fontWeight: 'bold', fontSize: 24}}>「{post.title}」 DONE！✨</ListItem.Title>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Icon
          name='comment'
          type="font-awesome-5"
          size={20}
          color='gray' 
          onPress={() => toggleModal()}
          />
          <Text style={{color: 'gray', marginHorizontal: 7}}>{post.replys.length}</Text>
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
  <Overlay
    isVisible={isModalVisible}
    onBackdropPress={toggleModal}
  >
    <ReplyForm CloseModal={toggleModal} post={post} userData={userData}/>
  </Overlay>
        {post.replys && <FlatList
          showsVerticalScrollIndicator={false}
          data={ post.replys}
          keyExtractor={(item) => item?.id?.toString()}
          renderItem={({item}) => {
            return(<Reply reply={item} toggleModal={toggleModal}/>);
          }}
        />}

  </View>
  )
}

export default Detail
