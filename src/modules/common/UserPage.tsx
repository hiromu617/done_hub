import React, {useState, useEffect} from 'react';
import { FlatList, KeyboardAvoidingView, StyleSheet, View, ActivityIndicator , ScrollView, RefreshControl,SafeAreaView } from 'react-native';
import { getUser } from '../Todo/Storage'
import { useNavigation } from '@react-navigation/native';
import axios from '../../constants/axios';
import DonePost from './DonePost'
import { Icon, Divider,Overlay,Button} from 'react-native-elements';
import firebase from 'firebase'
import OtherProfileInfo from './OtherProfileInfo'
import ProfileInfo from '../Profile/components/ProfileInfo'
import EditProfile from '../Profile/components/EditProfile'

function UserPage({route}) {
  const {user} = route.params;
  const navigation = useNavigation()
  const [userData, setData] = useState(user);
  const [userInfo, setUserInfo] = useState(null);
  const [refreshState, setRefreshData] = useState(false);
  const [userPostsData, setUserPostData] = useState();
  const [pageData, setPageData] = useState(2);
  const [isFollowed, setIsFollowed] = useState(false);
  const [currentUserUid, setCurrentUserUid] = useState(0);
  const [isCurrentUser, setisCurrentUser] = useState(false)
  const [isModalVisible, setModalVisible] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [followData, setFollowData] = useState({following: [], follower: []});
  const [doneCounts, setDoneCounts] = useState(0);
  
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    refreshData()
    // getSource(userData)
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
      setData(data)
      setCurrentUserUid(data.uid)
      axios.get('/api/users/' + user.uid,
      {
        params: {
          currentUserUid: data.uid
        }
      })
      .then(res => {
        console.log(res.data)
        setUserInfo(res.data.user)
        setDoneCounts(res.data.done_counts)
        setIsFollowed(res.data.isFollowed)
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
    axios.delete('/api/relationships/' + userInfo.id, {
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
        id: userInfo.id
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
        <Overlay
         isVisible={isModalVisible}
         fullScreen
        >
          <EditProfile toggleModal={toggleModal} userData={userData} imageSrc={imageSrc}/>        
        </Overlay>
        <FlatList
          ListHeaderComponent={isCurrentUser ?
            <ProfileInfo  userData={userInfo} followData={followData} toggleModal={toggleModal} imageSrc={imageSrc} doneCounts={doneCounts}/>
          :
          <OtherProfileInfo userData={userInfo} followData={followData} imageSrc={imageSrc} isFollowed={isFollowed} follow={follow} unfollow={unfollow} doneCounts={doneCounts} isCurrentUser={isCurrentUser}/>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshState}
              onRefresh={() => refreshData()}
            />
          }
          showsVerticalScrollIndicator={false}
          data={ userPostsData}
          keyExtractor={(item) => item?.id?.toString()}
          renderItem={({item}) => {
            return <DonePost post={item} userData={userData} image={imageSrc}/>;
          }}
          onEndReached={fetchData}
          onEndReachedThreshold={0.5}
        />
        <KeyboardAvoidingView>
          <Icon
          name='arrow-left'
          type="font-awesome" 
          color="#3B82F6"
          size={27}
          reverse
          raised
          containerStyle={{position: 'absolute', bottom: '7%', left: '5%'}}
          onPress={() => navigation.goBack()}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
  );
}

export default UserPage