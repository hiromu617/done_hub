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

function LoadingScreen(){
  const {dispatch} = useContext(UserContext);

  // componentDidMount(){
  //   this.checkedIfLogin()
  // }
  useEffect(() => {
    checkedIfLogin()
  },[]);
  const navigation = useNavigation()
  const checkedIfLogin = () => {  
    firebase.auth().onAuthStateChanged(
      function(user){
        if(user){
          // console.log(user.providerData[0].uid)
          navigation.navigate('MyTabs')

          axios.post('/api/users', { 
            user: {
              name: user.providerData[0].displayName, 
              uid: user.providerData[0].uid
            }
          })
          // .then(res => console.log(res))
          // .catch(e => console.log(e))

          dispatch({type: 'SET_USER', data: user.providerData[0]})
        }else {
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