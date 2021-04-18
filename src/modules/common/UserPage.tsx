import React, {useState, useEffect} from 'react';
import { StyleSheet, View, ActivityIndicator , ScrollView, RefreshControl,SafeAreaView } from 'react-native';
import { getUser } from '../Todo/Storage'
import { useNavigation } from '@react-navigation/native';
import axios from '../../constants/axios';
import UserPostList from '../Profile/components/UserPostList'
import { Divider,Overlay,Button} from 'react-native-elements';
import firebase from 'firebase'
import OtherProfileInfo from './OtherProfileInfo'

function UserPage({route}) {
  const {user} = route.params;
  const navigation = useNavigation()
  const [userData, setData] = useState();
  const [refreshState, setRefreshData] = useState(false);
  const [userPostsData, setUserPostData] = useState();
  const [pageData, setPageData] = useState(2);
  const [imageSrc, setImageSrc] = useState(null);
  const [followData, setFollowData] = useState({following: [], follower: []});
  const [isFollowed, setIsFollowed] = useState(false);
  const [currentUserUid, setCurrentUserUid] = useState(0);
  const [isCurrentUser, setisCurrentUser] = useState(false)
  useEffect(() => {
    refreshData()
    getSource(userData)
  },[]);
  const getAvatar =  (userData) => {
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
  const getSource = (userData) => {
    getAvatar(userData)
    .then(res => {
      setImageSrc(res)
    })
  }
  const refreshData = () => {
    setUserPostData(null)
    setImageSrc(null)
    getSource(userData)

    setRefreshData(true)
    getUser().then((data) => {
      axios.get('/api/users/' + user.uid,
      {
        params: {
          currentUserUid: data.uid
        }
      })
      .then(res => {
        setCurrentUserUid(data.uid)
        setIsFollowed(res.data.isFollowed)
        setData(res.data.user)
        if(user.uid === currentUserUid) setisCurrentUser(true)
        setFollowData({following: res.data.following, follower: res.data.follower})
      })
      .catch(e => console.log(e))
    })
    
    // ユーザの最新の投稿を取得
    axios.get('/api/done_posts', {
      params: {
        page: 1,
        uid: user.uid
        }
    })
    .then(res => {
      setPageData(2)
      setUserPostData(res.data)
      setRefreshData(false)
    })
    .catch(e => console.log(e))  
  }

  const fetchData = () => {
      axios.get('/api/done_posts', {
        params: {
          page: pageData,
          uid: user.uid
        }
      })
      .then(res => {
        if(res.data.length === 0 ) return
        setPageData(pageData + 1)
        // console.log("----------------------")
        // let postsData = res.data.done_posts.reverse()
        // setUserPostData(postsData)
        let Data = userPostsData
        let newData = Data.concat(res.data)
        setUserPostData(newData)
      })
  }
  const unfollow = async () => {
    axios.delete('/api/relationships/' + userData.id, {
      params: {
        currentUserUid: currentUserUid,
      }
    })
    setIsFollowed(false)
    console.log('succsess unfollow')
  }
  const follow = async () => {
    if(user.uid === currentUserUid) return
    axios.get('/api/relationships', {
      params: {
        currentUserUid: currentUserUid,
        id: userData.id
      }
    })
    setIsFollowed(true)
    console.log('succsess follow')
  }
  if(!userData){
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large'/>
      </View>
    )
  }
  return (
      <SafeAreaView style={{ flex: 1}}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshState}
              onRefresh={() => refreshData()}
            />
          }
        >
        <OtherProfileInfo userData={userData} followData={followData} imageSrc={imageSrc} isFollowed={isFollowed} follow={follow} unfollow={unfollow} isCurrentUser={isCurrentUser}/>
        <Divider style={{ marginTop: 10}} />
        {/* <Text>{userData.uid}</Text> */}
          <UserPostList posts={userPostsData} fetchData={fetchData} imageSrc={imageSrc} userData={userData}/>
        </ScrollView>
      </SafeAreaView>
  );
}

export default UserPage