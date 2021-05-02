// import React, { Component } from 'react';
// import {View, Text, StyleSheet, ActivityIndicator } from 'react-native';
// import firebase from 'firebase'

// class LoadingScreen extends Component{

//   componentDidMount(){
//     this.checkedIfLogin()
//   }

//   checkedIfLogin = () => {  
//     firebase.auth().onAuthStateChanged(
//       function(user){
//         alert(user)
//         if(user){
//           this.props.navigation.navigate('MyTabs')
//         }else {
//           this.props.navigation.navigate('LoginScreen')
//         }
//       }.bind(this)
//     )
//   }

//   render() {
//     return(
//       <View style={styles.container}>
//         <ActivityIndicator size='large'/>
//       </View>
//     )
//   }
// }

export default LoadingScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

import React, { Component, useContext, useEffect } from 'react';
import {View, Text, StyleSheet, ActivityIndicator,SafeAreaView } from 'react-native';
import firebase from 'firebase'
import {UserContext} from '../../../App'
import { useNavigation } from '@react-navigation/native';
import axios from '../../constants/axios'
import {storeUser} from '../Todo/Storage'

function LoadingScreen(){
  const {dispatch} = useContext(UserContext);

  // componentDidMount(){
  //   this.checkedIfLogin()
  // }
  useEffect(() => {
    console.log('loading...............')
    checkedIfLogin()
  },[]);
  const navigation = useNavigation()
  const checkedIfLogin = () => {  
    firebase.auth().onAuthStateChanged(
      async function(user){
        if(user){
          // uidが一致するユーザーがいれば、MyTabsに遷移
          await axios.get('/api/usersShow/' + user.providerData[0].uid)
          .then(res => {
            console.log(res.data)
            if(res.data){
              storeUser(res.data)
              navigation.navigate('MyTabs')
              return
            }else{
              // いない場合userレコードを作成しダッシュボードに遷移
              axios.post('/api/users', { 
                name: user.providerData[0].displayName, 
                uid: user.providerData[0].uid
              })
              .then(res => {
                console.log(res.data)
                storeUser(res.data)
                navigation.navigate('DashboardScreen')
              })
              .catch(e => console.log(e)) 
            }
          })
          

          // dispatch({type: 'SET_USER', data: user.providerData[0]})
        }else {
          // ログインしていなければloginに遷移
          navigation.navigate('LoginScreen')
        }
      }
    )
  }

    return(
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size='large'/>
      </SafeAreaView>
    )
}