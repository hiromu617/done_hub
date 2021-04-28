import React, {useEffect, useState} from 'react';
import { Alert, FlatList, StyleSheet, Text, View , ScrollView, RefreshControl} from 'react-native';
import { ListItem, Avatar, Icon, Overlay, Button } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import axios from '../../constants/axios';
import Reply from './Reply'
import Form from './Form'
import firebase from 'firebase'
import Modal from 'react-native-modal';
import Toast from 'react-native-root-toast';

const Detail: React.FC = ({route}) => {
  const navigation = useNavigation()
  const { post, initialImageSrc, userData, initialLikeState, initialLikeNum } = route.params;
  const [likeState, setLikeState] = useState(initialLikeState)
  const [likeNum, setLikeNum] = useState(initialLikeNum)
  const [refreshState, setRefreshData] = useState(false);
  const [postData, setPostData] = useState(post)
  const [replyData, setReplyData] = useState(post.replys)
  const [imageSrc, setImageSrc] = useState(initialImageSrc)
  const [autoFocusState, setAutoFocusState] = useState(false)
  const [deleteModalState, setDeleteModalState] = useState(false)

  useEffect(() => {
    if(initialLikeState === undefined){
      isLike()
    }
    if(initialImageSrc === undefined){
      getSource(post)
    }
    // isLike()
    // refreshData()
  },[]);

  const deletePost = async () => {
    Alert.alert(
      "投稿の削除",
      "本当に削除してもよろしいですか？",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => setDeleteModalState(false)
        },
        { text: "OK",
          onPress: () => {
            axios.delete('/api/done_posts/' + postData.id)
            .then(res => {
              setDeleteModalState(false)
              navigation.goBack()
              Toast.show('投稿を削除しました',{
                position: 50
              })
            })
            .catch(e => console.log(e))
          } 
        }
      ]
    )
    
  }

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
  const refreshData = () => {
    setRefreshData(true)
    axios.get('/api/done_posts/' + post.id)
    .then((res) => {
      setPostData(res.data)
      setReplyData(res.data.replys)
      setRefreshData(false)
    })
  }

  const refreshWithOutIndicator = () => {
    axios.get('/api/done_posts/' + post.id)
    .then((res) => {
      setPostData(res.data)
      setReplyData(res.data.replys)
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
      setLikeState(true)
      setLikeNum(likeNum+1)
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
      <Modal
      isVisible={deleteModalState}
      onBackdropPress={() => setDeleteModalState(false)}
      animationIn='slideInRight'
      animationOut='slideOutRight'
      backdropOpacity={0.3}
      style={{backgroundColor: 'white', position: 'absolute',top: '10%', right: 30, width: 100, height: 60, borderRadius: 10}}
      >
        <View 
          style={{backgroundColor: 'white'}}
        >
          <Button 
            icon={
              <Icon
                name="trash"
                type="font-awesome"
                color="#EF4444"
                size={20}
              />
            }
              title='削除' 
              type='clear'
              titleStyle={{color: '#EF4444', marginLeft: 10}}
              onPress={() => deletePost()}
            />
        </View>
      </Modal>
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
      <View style={{flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between'}}>
        <View  style={{flexDirection: 'row', alignItems: 'center'}}>
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
            
        <View
        >
          {userData.id == postData.user.id && <Icon
            name='ellipsis-v'
            type='font-awesome'
            color='gray'
            style={{padding: 10}}
            onPress={() => setDeleteModalState(true)}
          />}
        </View>
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
          containerStyle={{padding: 10}}
          onPress={() => setAutoFocusState(true)} 
          />
          <Text style={{color: 'gray', marginHorizontal: 7}}>{replyData.length}</Text>
          {!likeState && <Icon
          name='heart'
          type="font-awesome-5"
          size={20}
          color='#F87171' 
          containerStyle={{padding: 10}}
          onPress={() => like()}
          />}
          {likeState && <Icon
          name='heart'
          type="font-awesome-5"
          size={20}
          color='#F87171' 
          solid
          containerStyle={{padding: 10}}
          onPress={() => unlike()}
          />}
          <Text style={{color: '#F87171', marginHorizontal: 7}}>{likeNum}</Text>
          <Text style={{fontSize: 10, color: 'gray', width: '60%', textAlign: 'right'}}>{parseDate(post.created_at)}</Text>
        </View>
      </View>
    </ListItem.Content>
  </ListItem>
  {replyData && <FlatList
          showsVerticalScrollIndicator={false}
          data={ replyData}
          keyExtractor={(item) => item?.id?.toString()}
          renderItem={({item}) => {
            return(<Reply reply={item} userData={userData} refreshData={refreshWithOutIndicator}/>);
          }}
        />}
    </View>
    </ScrollView>
    <Form  post={postData} userData={userData} refreshData={refreshWithOutIndicator} autoFocus={autoFocusState} setAutoFocusState={setAutoFocusState}/>
  </View>
  )
}

export default Detail
