import React, {useState, useEffect} from 'react';
import { StyleSheet, View, ActivityIndicator , ScrollView, RefreshControl,SafeAreaView } from 'react-native';
import { getUser } from '../../Todo/Storage'
import { useNavigation } from '@react-navigation/native';
import axios from '../../../constants/axios';
import UserPostList from '../../common/UserPostList'
import ProfileInfo from './ProfileInfo'
import EditProfile from './EditProfile'
import { Divider,Overlay} from 'react-native-elements';
import firebase from 'firebase'
import { StatusBar } from 'expo-status-bar';

function ProfileHome() {
  // const {state} = useContext(SiteContext);
  const navigation = useNavigation()
  const [userData, setData] = useState();
  const [refreshState, setRefreshData] = useState(false);
  const [userPostsData, setUserPostData] = useState();
  const [pageData, setPageData] = useState(2);
  const [isModalVisible, setModalVisible] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [followData, setFollowData] = useState({following: 0, follower: 0});

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
      var spaceRef = storageRef.child(`images/${userData.uid}.jpg`);
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
      if(data.uid !== undefined) {
        setData(data);
        console.log(data)
      }
      console.log("----------------------")
      // console.log(data)
      axios.get('/api/users/following/' + data.uid)
      .then(res => {
        setFollowData(res.data)
      })
      axios.get('/api/done_posts', {
        params: {
          page: 1,
          uid: data.uid
        }
      })
      .then(res => {
        setPageData(2)
        // console.log("----------------------")
        // let postsData = res.data.done_posts.reverse()
        // setUserPostData(postsData)
        setUserPostData(res.data)
        setRefreshData(false)
      })
      .catch(e => console.log(e))
    })
  }

  const fetchData = () => {
      axios.get('/api/done_posts', {
        params: {
          page: pageData,
          uid: userData.uid
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

  if(!userData){
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large'/>
      </View>
    )
  }
  return (
      <SafeAreaView style={{ flex: 1}}>
      <StatusBar style="dark"/>

        <Overlay
         isVisible={isModalVisible}
         fullScreen
        >
          <EditProfile toggleModal={toggleModal} userData={userData} imageSrc={imageSrc}/>        
        </Overlay>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshState}
              onRefresh={() => refreshData()}
            />
          }
        >
        <ProfileInfo userData={userData} followData={followData} toggleModal={toggleModal} imageSrc={imageSrc}/>
        <Divider style={{ marginTop: 10}} />
        {/* <Text>{userData.uid}</Text> */}
          <UserPostList posts={userPostsData} fetchData={fetchData} imageSrc={imageSrc} userData={userData}/>
        </ScrollView>
      </SafeAreaView>
  );
}

export default ProfileHome