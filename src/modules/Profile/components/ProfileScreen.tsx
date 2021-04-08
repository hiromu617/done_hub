import React, {useReducer, useContext, useState, useEffect} from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator } from 'react-native';
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
  const [userPostsData, setUserPostData] = useState();
  const navigation = useNavigation()
  useEffect(() => {
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
      })
    })
  },[]);

  if(!userData){
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large'/>
      </View>
    )
  }
  return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: '20%' }}>
        <Text>{userData.name}</Text>
        {/* <Text>{userData.uid}</Text> */}
        <Button title="sign out" onPress={() =>{
          firebase.auth().signOut()
          navigation.navigate('LoadingScreen')
        }}/>
        <UserPostList posts={userPostsData}/>
      </View>
  );
}

export default ProfileScreen