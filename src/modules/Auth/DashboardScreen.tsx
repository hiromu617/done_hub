import React, { Component, useState } from 'react';
import firebase from 'firebase'
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator , ScrollView, RefreshControl,SafeAreaView } from 'react-native';
import { ButtonGroup, Avatar,Button,Icon} from 'react-native-elements';
import axios from '../../constants/axios';
import { useNavigation } from '@react-navigation/native';
import {storeUser, getUser} from '../Todo/Storage'
import User from '../Profile/objects/User'
import Toast from 'react-native-root-toast';

function DashboardScreen(){
  const navigation = useNavigation()
  const hub_list = ['英語', '数学', '物理', '化学','プログラミング' , 'CS', '経済学', 'スペイン語', '心理学', '人文学', '医学', '薬学']
  const [selectedHub, setSelectedHub] = useState([])
  const save = () => {
    getUser()
    .then(res => {
      axios.get('/api/users/' + res.uid + '/hubs', {
        params: {
          hub_list: selectedHub
        }
      })
      .then(res => {
        let newUser: User = {
          uid: res.data.uid,
          name: res.data.name,
          profile: res.data.profile,
          hub_list: res.data.hub_list,
          id: res.data.id
        }
        console.log('--------------------')
        // console.log(newUser)
        storeUser(newUser)
        navigation.navigate('MyTabs')
        Toast.show('DoneHubへようこそ！',{
          position: 50
        })
      })
    })
    
  }
  return(
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 10}}>
    <Text style={{fontSize: 26, fontWeight: 'bold', padding: 20}}>Hub一覧</Text>
    <Text style={{paddingHorizontal: 20,paddingBottom: 20}}>自分の勉強分野、興味分野を5個まで選んでください</Text>
    <ScrollView>

    <Text>
    {
      hub_list.map((l, i) => {
        if(selectedHub.includes(l)){
            return (
              <TouchableOpacity
              key={i}
              onPress={() => {
                let list = []
                selectedHub.map((item) => {
                  if(item !== l) list.push(item)
                })
                setSelectedHub(list)
              }}
              >  
           <LinearGradient 
           start={[0,1]}
           end={[1,0]}
           style={{flexDirection: 'row',alignItems: 'center', borderRadius: 13, paddingHorizontal: 11, paddingVertical: 5, margin: 1.5}}
           colors={['#0EA5E9', '#60A5FA']}
            >
              <Icon
              name="tag"
              color="white"
              size={16}
              />
              <Text style={{color: 'white', fontWeight: 'bold', lineHeight: 14, fontSize: 14}}>{l}</Text>
            </LinearGradient>
          </TouchableOpacity>
            )
          }else{
            return (
              <TouchableOpacity
              key={i}
              onPress={() => {
                let list = selectedHub.slice()
                list.push(l)
                setSelectedHub(list)
              }}
              
              >  
           <LinearGradient 
           start={[0,1]}
           end={[1,0]}
           style={{flexDirection: 'row',alignItems: 'center', borderRadius: 13, paddingHorizontal: 11, paddingVertical: 5, margin: 1.5}}
           colors={['transparent', 'transparent']}
           >
              <Icon
              name="tag"
              color="#0EA5E9"
              size={16}
              />
              <Text style={{color: '#0EA5E9', fontWeight: 'bold', lineHeight: 14, fontSize: 14}}>{l}</Text>
            </LinearGradient>
          </TouchableOpacity>
            )
          }
        })
      }
    </Text>
    </ScrollView>
    <View
      style={{padding: 20, position: 'absolute', bottom: '15%', right: 0}}
    >
      <Button 
        buttonStyle={{backgroundColor: '#3B82F6',paddingHorizontal: 15}}
        titleStyle={{fontWeight: 'bold', marginRight: 10}}
        title='DoneHubを始める'
        iconRight
        icon={
          <Icon
            name="arrow-right"
            type="font-awesome"
            color="white"
            size={20}
          />
        }
        onPress={() => save()}
      /> 
    </View>
  </SafeAreaView>
  )
}

export default DashboardScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})