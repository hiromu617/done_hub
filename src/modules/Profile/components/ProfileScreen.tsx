import React, {useReducer, useContext, useState, useEffect} from 'react';
import { StyleSheet, View, ActivityIndicator , ScrollView, RefreshControl,SafeAreaView } from 'react-native';
import firebase from 'firebase'
import UserContext from '../../../../App'
import { storeUser, getUser } from '../../Todo/Storage'
import { useNavigation } from '@react-navigation/native';
import axios from '../../../constants/axios';
import UserPostList from './UserPostList'
import ProfileInfo from './ProfileInfo'
import { SiteContext } from '../../Todo/components/TodoScreen'
import { Avatar,Divider, Text, Button, Badge, Icon} from 'react-native-elements';

function ProfileScreen() {
  // const {state} = useContext(SiteContext);
  const [userData, setData] = useState();
  const [refreshState, setRefreshData] = useState(false);
  const [userPostsData, setUserPostData] = useState();
  const [pageData, setPageData] = useState(2);
  const navigation = useNavigation()
  useEffect(() => {
    refreshData()
  },[]);

  const refreshData = () => {
    setRefreshData(true)
    getUser().then((data) => {
      if(data.uid !== undefined) {
        setData(data);
        // console.log(data)
      }
      axios.get('/api/done_posts', {
        params: {
          page: 1,
          uid: data.uid
        }
      })
      .then(res => {
        setPageData(2)
        console.log("----------------------")
        // let postsData = res.data.done_posts.reverse()
        // setUserPostData(postsData)
        setUserPostData(res.data)
        setRefreshData(false)
      })
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
        console.log("----------------------")
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
        <ProfileInfo userData={userData}/>
        <Divider style={{ marginTop: 10}} />
        {/* <Text>{userData.uid}</Text> */}
        
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshState}
              onRefresh={() => refreshData()}
            />
          }
        >
          <UserPostList posts={userPostsData} fetchData={fetchData} />
        </ScrollView>
      </SafeAreaView>
  );
}

export default ProfileScreen