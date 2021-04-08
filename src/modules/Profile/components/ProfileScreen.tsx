import React, {useReducer, useContext, useState, useEffect} from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator , ScrollView, RefreshControl,SafeAreaView } from 'react-native';
import firebase from 'firebase'
import UserContext from '../../../../App'
import { storeUser, getUser } from '../../Todo/Storage'
import { useNavigation } from '@react-navigation/native';
import axios from '../../../constants/axios';
import UserPostList from './UserPostList'
import { SiteContext } from '../../Todo/components/TodoScreen'

function ProfileScreen() {
  // const {state} = useContext(SiteContext);
  const [userData, setData] = useState();
  const [refreshState, setRefreshData] = useState(false);
  const [userPostsData, setUserPostData] = useState();
  const navigation = useNavigation()
  useEffect(() => {
    fetchData()
  },[]);

  const fetchData = () => {
    setRefreshData(true)
    getUser().then((data) => {
      if(data.uid !== undefined) {
        setData(data);
        console.log(data)
      }
      axios.get('/api/users/' + data.uid)
      .then(res => {
        console.log("----------------------")
        let postsData = res.data.done_posts.reverse()
        setUserPostData(postsData)
        setRefreshData(false)
      })
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
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>{userData.name}</Text>
        {/* <Text>{userData.uid}</Text> */}
        <Button title="sign out" onPress={() =>{
          firebase.auth().signOut()
          navigation.navigate('LoadingScreen')
        }}/>
        
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshState}
              onRefresh={() => fetchData()}
            />
          }
        >
          <UserPostList posts={userPostsData}/>
        </ScrollView>
      </SafeAreaView>
  );
}

export default ProfileScreen