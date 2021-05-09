import React, { useState, useRef , useContext, useEffect } from 'react';
import {Button, View, Text, StyleSheet, ActivityIndicator,SafeAreaView } from 'react-native';
import firebase from 'firebase'
import {UserContext} from '../../../App'
import { useNavigation } from '@react-navigation/native';
import axios from '../../constants/axios'
import {storeUser} from '../Todo/Storage'
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Subscription } from '@unimodules/core'

function LoadingScreen(){
  const {dispatch} = useContext(UserContext);
  const [expoPushToken, setExpoPushToken] = useState(null)
  const [notification, setNotification] = useState<Notifications.Notification>()
  const notificationListener = useRef<Subscription>()
  const responseListener = useRef<Subscription>()
  // componentDidMount(){
    //   this.checkedIfLogin()
  // }
  useEffect(() => {
      checkedIfLogin()
    console.log('loading...............')
    // Expo Pushトークンを取得
  },[]);

  const navigation = useNavigation()
  const checkedIfLogin = () => {  
    registerForPushNotificationsAsync().then(token => {
      token && setExpoPushToken(token)
      firebase.auth().onAuthStateChanged(
      async function(user){
        if(user){
          // alert(user.providerData[0].fullName)
          // console.log('Firebase Auth result: ', user)
          // console.log(user.displayName)
          // uidが一致するユーザーがいれば、MyTabsに遷移
          await axios.get('/api/usersShow', {
            params: {
              uid: user.uid,
              expo_push_token: token
            }
          })
          .then(res => {
            console.log(res.data)
            if(res.data){
              storeUser(res.data)
              navigation.navigate('MyTabs')
              return
            }else{
              // いない場合userレコードを作成しダッシュボードに遷移
              let name: String = "ユーザー"
              if(user.displayName !== null && user.displayName !== undefined){
                name = user.displayName
              }
              axios.post('/api/users', { 
                name: name, 
                uid: user.uid,
                expo_push_token: expoPushToken
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
    })
    
    }

    return(
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size='large'/>
        {/* <Button 
            title="sign out" 
            onPress={() =>{
              firebase.auth().signOut()
              navigation.navigate('LoginScreen')
            }
          }/> */}
          <Text>{expoPushToken}</Text>
          <Button
            title='プッシュ通知'
            onPress={async () => {
              await sendPushNotification(expoPushToken)
            }}
          />
      </SafeAreaView>
    )
  }
  export default LoadingScreen

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    }
  })

  async function sendPushNotification(expoPushToken: string) {
    const pushMessage = {
      to: expoPushToken,
      sound: 'default',
      title: 'hello',
      body: 'world',
    }
  
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pushMessage)
    })
  }
  
  async function registerForPushNotificationsAsync() {
    let token: string = ''
  
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!')
        return
      }
      token = (await Notifications.getExpoPushTokenAsync()).data
    } else {
      alert('Must use physical device for Push Notifications')
    }
  
    // if (Platform.OS === 'android') {
    //   Notifications.setNotificationChannelAsync('default', {
    //     name: 'default',
    //     importance: Notifications.AndroidImportance.MAX,
    //     vibrationPattern: [0, 250, 250, 250],
    //     lightColor: '#FF231F7C'
    //   })
    // }
  
    return token
  }