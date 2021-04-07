import React, {useReducer, useContext, useState, useEffect} from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator } from 'react-native';
import firebase from 'firebase'
import UserContext from '../../../../App'
import { storeUser, getUser } from '../../Todo/Storage'
import { useNavigation } from '@react-navigation/native';

function ProfileScreen() {
  // const {state} = useContext(UserContext);
  const [userData, setData] = useState();
  const navigation = useNavigation()

  useEffect(() => {
    getUser().then((data) => {
      if(data.uid !== undefined) {
        setData(data);
        // console.log(data)
      }
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{userData.name}</Text>
      {/* <Text>{userData.uid}</Text> */}
      <Button title="sign out" onPress={() =>{
        firebase.auth().signOut()
        navigation.navigate('LoadingScreen')
      }}/>
      </View>
  );
}

export default ProfileScreen