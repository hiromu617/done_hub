import React, {useEffect, useState} from 'react';
import { FlatList, StyleSheet, Text, View , ScrollView, RefreshControl} from 'react-native';
import { ListItem, Avatar, Icon, Overlay } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import axios from '../../constants/axios';
import Reply from './Reply'
import ReplyForm from './ReplyForm'
import Form from './Form'

const Detail: React.FC = ({route}) => {
  const navigation = useNavigation()
  const { post, imageSrc, userData, initialLikeState, initialLikeNum } = route.params;
  const [likeState, setLikeState] = useState(initialLikeState)
  const [likeNum, setLikeNum] = useState(initialLikeNum)
  const [refreshState, setRefreshData] = useState(false);
  const [postData, setPostData] = useState(post)
  const [replyData, setReplyData] = useState(post.replys)
  useEffect(() => {
    // isLike()
    // refreshData()
  },[]);
  const refreshData = () => {
    setRefreshData(true)
    setReplyData([])
    axios.get('/api/done_posts/' + post.id)
    .then((res) => {
      setPostData(res.data)
      setReplyData(res.data.replys)
      setRefreshData(false)
    })
  }
  const parseDate = (val) => {
    return val.toString().replace(/([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2})([\w|:|.|+]*)/, "$2/$3 $4:$5")
  }

  const isLike = () => {
    setLikeNum(postData.likes.length)
    postData.likes.map(p => {
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
        done_post_id: postData.id
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
        done_post_id: postData.id
      }
    })
    .then(() => {
      setLikeNum(likeNum-1)
      setLikeState(false)
    })
  }
  return (
    <View style={{height: '100%'}}>
    <ScrollView
      refreshControl={
      <RefreshControl
        refreshing={refreshState}
        onRefresh={() => refreshData()}
      />
      }
      style={{flex:1}}
    >
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
                user: postData.user
              })}
            />}
            {!imageSrc && <Avatar 
              rounded
              size='medium'
              title={post.user.name[0]} 
              containerStyle={{backgroundColor: 'gray', marginRight: 10}}
              onPress={() => navigation.navigate('UserPage', 
              {
                user: postData.user
              })}
            />}
        <ListItem.Title  style={{paddingBottom: 5,fontWeight: 'bold'}}>{post.user.name}</ListItem.Title>
      </View>
      <View  style={{width: '100%', paddingTop: 10}}>
        {postData.comment.length > 0 && <Text style={{backgroundColor: '#EFF6FF', width: '100%', padding: 8, borderRadius: 10, fontSize: 14}}>{post.comment}</Text>}
        {postData.title && <ListItem.Title style={{paddingVertical: 20,fontWeight: 'bold', fontSize: 18}} >「{post.title}」 DONE！✨</ListItem.Title>}
        {!postData.title && 
          <FlatList
          showsVerticalScrollIndicator={false}
          style={{padding: 3, margin: 20, backgroundColor: '#F4F4F5'}}
          data={ JSON.parse(postData.tasks[0])}
          renderItem={({item}) => {
            const color: string = item.checked ? '#1D4ED8' : '#BFDBFE';
            return (
              <ListItem 
                bottomDivider
              >
                <Icon
                  name='check'
                  color={color}
                />
                <Text>{item.name}</Text>  
              </ListItem>
            );
          }}
        />
        }
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Icon
          name='comment'
          type="font-awesome-5"
          size={20}
          color='gray' 
          />
          <Text style={{color: 'gray', marginHorizontal: 7}}>{replyData.length}</Text>
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
  {replyData && <FlatList
          showsVerticalScrollIndicator={false}
          data={ replyData}
          keyExtractor={(item) => item?.id?.toString()}
          renderItem={({item}) => {
            return(<Reply reply={item}/>);
          }}
        />}
    </View>
    </ScrollView>
    <Form  post={postData} userData={userData} refreshData={refreshData}/>
  </View>
  )
}

export default Detail
